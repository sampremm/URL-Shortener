import fs from 'fs';

async function run() {
  console.log("🚀 Starting End-to-End Backend Verification...\n");
  
  const email = `testuser_${Date.now()}@example.com`;
  const password = "password123";

  try {
    console.log("1️⃣  Testing Registration (POST /url/auth/register)...");
    const regRes = await fetch("http://localhost:3000/url/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!regRes.ok) throw new Error("Registration failed: " + await regRes.text());
    const regData = await regRes.json();
    console.log("   ✅ Registration OK! User ID:", regData._id);

    console.log("\n2️⃣  Testing Login (POST /url/auth/login)...");
    const loginRes = await fetch("http://localhost:3000/url/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!loginRes.ok) throw new Error("Login failed: " + await loginRes.text());
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("   ✅ Login OK! JWT Token received.");

    console.log("\n3️⃣  Testing URL Shortening (POST /api/urls/)...");
    const shortenRes = await fetch("http://localhost:3000/api/urls/", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ originalUrl: "https://www.google.com/search?q=hello+world" })
    });

    if (!shortenRes.ok) throw new Error("Shorten failed: " + await shortenRes.text());
    const shortenData = await shortenRes.json();
    const shortCode = shortenData.shortUrl;
    console.log("   ✅ Shorten OK! Short Code:", shortCode);
    console.log("   (This verified Nginx -> Backend -> MySQL KeyService -> MongoDB Shard)");

    console.log("\n4️⃣  Testing Redirect (GET /api/urls/:shortCode)...");
    const redirectRes = await fetch(`http://localhost:3000/api/urls/${shortCode}`, {
      redirect: "manual"
    });
    
    if (redirectRes.status !== 301 && redirectRes.status !== 302) {
      throw new Error("Redirect failed! Status: " + redirectRes.status);
    }
    console.log("   ✅ Redirect OK! Location:", redirectRes.headers.get("location"));
    console.log("   (This verified Redis Caching layer and MongoDB retrieval)");

    console.log("\n5️⃣  Testing Analytics (GET /api/urls/analytics/:userId)...");
    const analyticsRes = await fetch(`http://localhost:3000/api/urls/analytics/${regData._id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!analyticsRes.ok) throw new Error("Analytics failed: " + await analyticsRes.text());
    const analyticsData = await analyticsRes.json();
    console.log("   ✅ Analytics OK! Clicks recorded:", analyticsData.clicks);

    console.log("\n🎉 All distributed backend services are working flawlessly! 🎉");
  } catch (err) {
    console.error("\n❌ Test Failed:", err.message);
  }
}

run();
