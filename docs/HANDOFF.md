# บันทึกส่งต่องาน (Handoff log)

เพิ่มรายการใหม่ **ไว้บนสุด** · agent ทุกตัวอ่าน 3 รายการล่าสุดก่อนเริ่มงาน

แม่แบบ:
```
## YYYY-MM-DD · <Codex|Claude> · <branch> · TASKS #<n>
- ทำอะไร:
- ไฟล์/หมวดที่แตะ:
- ทดสอบ: (ผล node scripts/check.mjs + สิ่งที่เปิดดูในเบราว์เซอร์)
- ค้าง/ไม่แน่ใจ:
- ถึงคนต่อไป:
```

---

## 2026-11-17 · Claude · main · deploy
- ทำอะไร: เจ้าของสั่ง deploy เวอร์ชันล่าสุด → push `main` เข้า `gh-pages` (เลิกตรึงที่ `a50eea3`) · แก้กติกา deploy ใน `AGENTS.md`
- ไฟล์/หมวดที่แตะ: `AGENTS.md` (Git และการ Deploy) · ไม่แตะ `gas_swap_3d.html`
- ทดสอบ: `node scripts/check.mjs` ผ่าน · เปิดเว็บสาธารณะตรวจว่าเป็นเวอร์ชันใหม่
- ถึงคนต่อไป: deploy เฉพาะเมื่อเจ้าของสั่ง

## 2026-11-16 · Claude · claude/fix-dims-toggle
- ทำอะไร: แก้บั๊กปุ่ม "↔ ขนาดรวม" ปิดแล้วป้ายตัวเลขยังค้าง — CSS2DRenderer (three r160) ไม่สนใจ visible ของกลุ่มแม่
  จึงเพิ่ม `setDimsVisible(v)` ตั้ง visible ให้ป้าย CSS2D ทุกอันใน `dimGroup` · เพิ่ม `dimGroup` ใน `window.gasSim`
- ไฟล์/หมวดที่แตะ: `gas_swap_3d.html` หมวด 6 (`setDimsVisible`, `buildDims`), หมวด 9 (ปุ่ม bDims), ท้ายไฟล์ (`gasSim`)
- ทดสอบ: `node scripts/check.mjs` ผ่าน · นับป้ายผ่าน `gasSim.dimGroup`: เปิด 9/9 → ปิด 0/9 → ปิด+สลับคน 0/7 → เปิด 7/7
- ถึงคนต่อไป: ถ้าเพิ่มป้าย CSS2D ในกลุ่มอื่นที่ซ่อนทั้งกลุ่มได้ ต้องตั้ง visible ที่ตัวป้ายเองด้วย

## 2026-11-16 · Claude · claude/screen-dims-no-cost
- ทำอะไร: (1) เอาแผงประเมินราคาโครงสร้างออกทั้งหมด (HTML + หมวด 7.5 + `COST`) ตามที่เจ้าของสั่ง
  (2) เพิ่มกรอบสีส้ม + เส้นบอกขนาดจริงของจอ M1-27OF-A2: กว้าง 368.7 · สูง 619.1 · ลึก 39.4 มม. (วางแนวตั้ง)
  + ป้าย "619.1 × 368.7 × 39.4 มม." — เปิด/ปิดพร้อมปุ่ม "ขนาดรวม"
- ไฟล์/หมวดที่แตะ: `gas_swap_3d.html` หมวด 5 (`layout.screen`), 6 (`screenDims()`, `dimLine` รับสี/คลาส), CSS `.lbl.s`;
  ลบหมวด 7.5 · `AGENTS.md`, `docs/TASKS.md` (#1, #5 ยกเลิก) · เพิ่ม `.claude/launch.json` (python http.server :8080)
- ทดสอบ: `node scripts/check.mjs` ผ่าน · เปิด http://localhost:8080/gas_swap_3d.html Console ไม่มี error, ป้ายจอแสดงครบ ไม่ทับกัน
- ค้าง/ไม่แน่ใจ: เมื่อมองจากมุมเริ่มต้น ป้าย "สูง" ฝั่งซ้ายอาจถูกแผงเมนูบัง — หมุนมุมมองแล้วเห็น
- ถึงคนต่อไป: ไม่มีงานเกี่ยวกับราคาแล้ว อย่าเพิ่มกลับโดยไม่ได้รับคำสั่ง

## 2026-11-11 · Claude · main · ตั้งระบบทำงานร่วมกัน
- ทำอะไร: เพิ่ม `AGENTS.md` (กติกากลาง), `CLAUDE.md`, `docs/TASKS.md`, `docs/HANDOFF.md`, `scripts/check.mjs`
- ไฟล์/หมวดที่แตะ: ไม่แตะ `gas_swap_3d.html`
- ทดสอบ: `node scripts/check.mjs` ผ่าน
- ค้าง/ไม่แน่ใจ: ราคาต่อหน่วยใน `COST` ยังเป็นค่าประมาณ (ไม่พบราคาตลาดปี 2569) → TASKS #1
- ถึงคนต่อไป: `gh-pages` ตรึงที่ `a50eea3` ตามที่เจ้าของสั่ง — ห้าม push เข้า `gh-pages`
