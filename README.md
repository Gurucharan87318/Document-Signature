# 📄 Document Signature
![Screenshot 2025-07-03 165506](https://github.com/user-attachments/assets/8db6a3f0-d8ea-49dc-a6f8-8da17369e251)
A full-stack web application built with **Next.js** that allows users to:

- Upload and view PDF documents

- Upload a signature image (e.g., `sign.jpg`)
- **Drag and place** the signature visually over the PDF
- **Embed** the signature into the actual PDF using `pdf-lib`
- Download the signed PDF file

This project simulates a simplified **DocuSign**-like interface for digital document signing.

## 📦 Features

- 🧾 PDF Upload and Preview
- 🖼️ Image-based Signature Upload
- ✍️ Drag-and-Drop Signature Placement
- 🧠 Smart Coordinate Conversion (DOM → PDF)
- 📥 Download Signed Document
- ⚡ Powered by `pdf-lib`, `react-draggable`, and `Next.js`

---

## 🛠️ Tech Stack

| Layer      | Technology                |
|------------|---------------------------|
| Frontend   | Next.js (React)           |
| Styling    | Tailwind CSS / MUI        |
| Drag & Drop| `react-draggable`         |
| PDF Engine | `pdf-lib`                 |
| Deployment | Vercel / Netlify / Railway|
