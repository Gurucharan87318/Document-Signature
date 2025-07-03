import PDFViewer from "@/components/PDFViewer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Existing PDF Viewer */}
      <div className="mb-8">
        <PDFViewer />
      </div>
    </div>
  );
}
