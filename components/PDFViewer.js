import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import Draggable from 'react-draggable';
import {
  Typography,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Box,
  Input
} from '@mui/material';
import { FileCopy, Edit } from '@mui/icons-material';

export default function PDFViewer() {
  const [pdf, setPdf] = useState(null);
  const [signImage, setSignImage] = useState(null);
  const [pageNumberToAddSignature, setPageNumberToAddSignature] = useState(1);
  const [signing, setSigning] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });

  const iframeRef = useRef();

  const handlePdfUpload = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => setPdf(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => setSignImage(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

 const embedSignature = async () => {
  if (!pdf || !signImage) return;
  setSigning(true);

  try {
    const existingPdfBytes = Uint8Array.from(atob(pdf.split(',')[1]), c => c.charCodeAt(0));
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pngImage = await pdfDoc.embedPng(signImage);
    const pngDims = pngImage.scale(0.17);

    const pages = pdfDoc.getPages();
    const page = pages[pageNumberToAddSignature - 1];

    const { width: pdfWidth, height: pdfHeight } = page.getSize();

    // DOM size of the iframe
    const iframeRect = iframeRef.current?.getBoundingClientRect();
    if (!iframeRect) throw new Error("Iframe not loaded");

    const renderWidth = iframeRect.width;
    const renderHeight = iframeRect.height;

    // 👇 Scale position from screen -> PDF points
    const scaleX = pdfWidth / renderWidth;
    const scaleY = pdfHeight / renderHeight;

    const pdfX = position.x * scaleX;
    const pdfY = pdfHeight - (position.y * scaleY) - pngDims.height;

    page.drawImage(pngImage, {
      x: pdfX,
      y: pdfY,
      width: pngDims.width,
      height: pngDims.height,
    });

    const signedPdfBytes = await pdfDoc.save();
    const blob = new Blob([signedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signed_document.pdf';
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error signing PDF:', err);
  }

  setSigning(false);
};


  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            <FileCopy sx={{ mr: 1 }} />
            Document Signature 
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Input type="file" onChange={handlePdfUpload} accept="application/pdf" />
        </Grid>

        <Grid item xs={12}>
          <Input type="file" onChange={handleImageUpload} accept="image/*" />
        </Grid>

        <Grid item xs={12}>
          <Typography>Page Number:</Typography>
          <Input
            type="number"
            value={pageNumberToAddSignature}
            onChange={(e) => setPageNumberToAddSignature(Number(e.target.value))}
            inputProps={{ min: 1 }}
          />
        </Grid>

        {pdf && (
          <Grid item xs={12}>
            <Box position="relative" width="100%" maxWidth="800px" margin="0 auto">
              {/* PDF Display */}
              <iframe
                ref={iframeRef}
                title="pdf-frame"
                src={pdf}
                width="100%"
                height="1000px"
                style={{ border: '1px solid gray' }}
              />

              {/* Draggable Signature Preview */}
              {signImage && (
                <Draggable position={position} onDrag={handleDrag}>
                  <img
                    src={signImage}
                    alt="Signature"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '120px',
                      height: 'auto',
                      cursor: 'move',
                      zIndex: 10,
                    }}
                  />
                </Draggable>
              )}
            </Box>
          </Grid>
        )}

        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={embedSignature}
              disabled={signing || !signImage || !pdf}
              startIcon={signing ? <CircularProgress size={16} /> : <Edit />}
            >
              {signing ? 'Signing...' : 'Sign & Download'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
