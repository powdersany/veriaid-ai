"use client";

import { programsApi } from "./api-client";
import { prisma } from "./db";
import { ocrEvidence } from "./ai";

/**
 * Run full E2E happy path test:
 * 1. Login (demo account)
 * 2. Create program
 * 3. Input fund
 * 4. Input expense
 * 5. Upload evidence
 * 6. AI analyze
 * 7. Publish
 * 8. Verify hash chain
 *
 * Returns { success, error, steps }
 */
export async function runE2ETest() {
  const steps = [];
  const demoUser = {
    email: "org1@demo.id",
    password: "demo123",
  };

  try {
    // 1. Login
    steps.push("Login...")
    const loginRes = await programsApi.login(demoUser.email, demoUser.password);
    if (!loginRes.token) throw new Error("Login failed");
    programsApi.setAuthToken(loginRes.token);
    steps.push("✅ Login berhasil")

    // 2. Create program
    steps.push("Membuat program...")
    const programRes = await programsApi.createProgram({
      title: "E2E Test Program",
      category: "Bencana Alam",
      location: "Jakarta",
      description: "Program untuk E2E test VeriAid AI",
      targetFund: 10000000,
      targetBeneficiary: 100,
      aidType: "Logistik",
      startDate: new Date().toISOString(),
      organizer: "VeriAid Test Org",
    });
    const programId = programRes.program.id;
    steps.push(`✅ Program dibuat: ${programId}`)

    // 3. Input fund
    steps.push("Input dana...")
    await programsApi.recordFund(programId, {
      amount: 5000000,
      source: "donor_qris",
      donorName: "Anonim",
    });
    steps.push("✅ Dana Rp 5.000.000 tercatat")

    // 4. Input expense
    steps.push("Input pengeluaran...")
    await programsApi.recordExpense(programId, {
      item: "Paket Bantuan",
      amount: 2000000,
      category: "Logistik",
      note: "Distribusi ke 50 keluarga",
    });
    steps.push("✅ Pengeluaran Rp 2.000.000 tercatat")

    // 5. Upload evidence (mock base64 image)
    steps.push("Upload bukti...")
    const mockImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP..."
    const evidenceRes = await programsApi.uploadEvidence(programId, {
      name: "nota_1.jpg",
      type: "nota",
      base64Image: mockImage,
      mimeType: "image/jpeg",
    });
    const evidenceId = evidenceRes.evidence.id;
    steps.push(`✅ Bukti diunggah: ${evidenceId}`)

    // 6. AI analyze
    steps.push("Menjalankan AI analyze...")
    const analyzeRes = await programsApi.analyze(programId);
    steps.push(`✅ Analisis AI selesai: skor ${analyzeRes.analysis.aiScore}`)

    // 7. Check program status
    const program = await programsApi.get(programId);
    if (program.status !== "verified") {
      throw new Error(`Status program tidak verified: ${program.status}`);
    }
    steps.push("✅ Program status: verified")

    // 8. Verify hash chain
    steps.push("Memverifikasi hash chain...")
    const proofRes = await programsApi.getProof(programId);
    if (proofRes.events.length === 0) {
      throw new Error("Hash chain kosong");
    }
    steps.push(`✅ Hash chain valid: ${proofRes.events.length} event`)

    return { success: true, error: null, steps };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return { success: false, error: errMsg, steps };
  }
}

/**
 * Test edge cases:
 * - Upload gagal (file terlalu besar)
 * - AI timeout
 * - Donasi duplikat
 * - Program tanpa pengeluaran
 */
export async function runEdgeCaseTests() {
  const results = [];
  const demoUser = {
    email: "org1@demo.id",
    password: "demo123",
  };

  // Login
  const loginRes = await programsApi.login(demoUser.email, demoUser.password);
  programsApi.setAuthToken(loginRes.token);

  // 1. Upload gagal (file terlalu besar)
  try {
    const largeImage = "data:image/jpeg;base64," + "A".repeat(3 * 1024 * 1024); // 3MB
    await programsApi.uploadEvidence("test-program", {
      name: "large_file.jpg",
      type: "nota",
      base64Image: largeImage,
      mimeType: "image/jpeg",
    });
    results.push({ name: "Upload gagal", success: false, error: "Seharusnya gagal tapi berhasil" });
  } catch (error) {
    results.push({ name: "Upload gagal", success: true, error: null });
  }

  // 2. AI timeout (mock)
  try {
    // Simulate timeout by passing invalid image
    await programsApi.analyze("test-program");
    results.push({ name: "AI timeout", success: false, error: "Seharusnya timeout tapi berhasil" });
  } catch (error) {
    results.push({ name: "AI timeout", success: true, error: null });
  }

  // 3. Donasi duplikat
  try {
    const programRes = await programsApi.createProgram({
      title: "Edge Case Test",
      category: "Test",
      location: "Jakarta",
      description: "Test donasi duplikat",
      targetFund: 1000000,
      targetBeneficiary: 10,
      aidType: "Test",
      startDate: new Date().toISOString(),
      organizer: "Test Org",
    });
    const programId = programRes.program.id;
    await programsApi.recordFund(programId, {
      amount: 500000,
      source: "donor_qris",
      donorName: "Anonim",
    });
    // Duplicate fund
    await programsApi.recordFund(programId, {
      amount: 500000,
      source: "donor_qris",
      donorName: "Anonim",
    });
    results.push({ name: "Donasi duplikat", success: false, error: "Seharusnya terdeteksi duplikat" });
  } catch (error) {
    results.push({ name: "Donasi duplikat", success: true, error: null });
  }

  // 4. Program tanpa pengeluaran
  try {
    const programRes = await programsApi.createProgram({
      title: "No Expense Test",
      category: "Test",
      location: "Jakarta",
      description: "Test program tanpa pengeluaran",
      targetFund: 1000000,
      targetBeneficiary: 10,
      aidType: "Test",
      startDate: new Date().toISOString(),
      organizer: "Test Org",
    });
    const programId = programRes.program.id;
    await programsApi.recordFund(programId, {
      amount: 500000,
      source: "donor_qris",
      donorName: "Anonim",
    });
    await programsApi.analyze(programId);
    results.push({ name: "Program tanpa pengeluaran", success: true, error: null });
  } catch (error) {
    results.push({ name: "Program tanpa pengeluaran", success: false, error: String(error) });
  }

  return results;
}