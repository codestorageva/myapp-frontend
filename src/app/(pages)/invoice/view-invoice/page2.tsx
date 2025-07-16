'use client'
import { InvoiceDetails } from '@/app/types/invoice'
import React, { FC, useRef } from 'react'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
    PDFViewer,
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    section: {
        marginBottom: 10,
        borderBottom: '1 solid #ccc',
        paddingBottom: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bold: {
        fontWeight: 'bold',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#eee',
        padding: 4,
        border: '1 solid #ccc',
    },
    cell: {
        flex: 1,
        padding: 4,
        border: '1 solid #ccc',
    },
});

const InvoicePDF = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <View style={styles.row}>
                    <Image src="https://res.cloudinary.com/dqlgicmdq/image/upload/v1745907899/px6naek0osyvlnjuyeta.png" style={{ width: 60, height: 60 }} />
                    <View>
                        <Text style={styles.bold}>Vaistra Technologies</Text>
                        <Text>Panch Hatdi, 2nd Floor, Kuber Kastbhanjan</Text>
                        <Text>Near Railway Station</Text>
                        <Text>Porbandar</Text>
                        <Text>PH NO. 0286-2265777</Text>
                        <Text><Text style={styles.bold}>GSTIN:</Text> 24WEER6982DFYRY</Text>
                    </View>
                </View>
            </View>
            {/* Invoice Info */}
            <View style={styles.section}>
                <View style={styles.row}>
                    <Text style={styles.bold}>Tax Invoice</Text>
                    <Text>Original</Text>
                </View>
            </View>

            {/* Details */}
            <View style={styles.section}>
                <View style={styles.row}>
                    <View>
                        <Text><Text style={styles.bold}>Invoice No:</Text> VTPL425001</Text>
                        <Text><Text style={styles.bold}>Invoice Date:</Text> 11/04/2025</Text>
                        <Text><Text style={styles.bold}>Terms:</Text> Due On Receipt</Text>
                        <Text><Text style={styles.bold}>Due Date:</Text> 30/04/2025</Text>
                    </View>
                    <Text><Text style={styles.bold}>Place Of Supply:</Text> Gujarat (24)</Text>
                </View>
            </View>

            {/* Bill & Ship To */}
            <View style={styles.section}>
                <View style={styles.row}>
                    <View>
                        <Text style={styles.bold}>Bill To</Text>
                        <Text>Jenishbhai</Text>
                        <Text>Old Manechkchok</Text>
                        <Text>Porbandar, Gujarat 360575</Text>
                        <Text>India</Text>
                    </View>
                    <View>
                        <Text style={styles.bold}>Ship To</Text>
                        <Text>New GIDC Vanana</Text>
                        <Text>Porbandar, Gujarat 360575</Text>
                        <Text>India</Text>
                    </View>
                </View>
            </View>

            {/* Items Table */}
            <View style={styles.section}>
                <View style={styles.tableHeader}>
                    <Text style={styles.cell}>#</Text>
                    <Text style={styles.cell}>Item & Description</Text>
                    <Text style={styles.cell}>HSN / SAC</Text>
                    <Text style={styles.cell}>Qty</Text>
                    <Text style={styles.cell}>Unit</Text>
                    <Text style={styles.cell}>Rate</Text>
                    <Text style={styles.cell}>GST %</Text>
                    <Text style={styles.cell}>Amount</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.cell}>1</Text>
                    <Text style={styles.cell}>New Product</Text>
                    <Text style={styles.cell}>909090</Text>
                    <Text style={styles.cell}>1.00</Text>
                    <Text style={styles.cell}>Box</Text>
                    <Text style={styles.cell}>1,800.00</Text>
                    <Text style={styles.cell}>9</Text>
                    <Text style={styles.cell}>20,000.00</Text>
                </View>
            </View>

            {/* Totals and Conditions */}
            <View style={styles.section}>
                <Text>Total GST: Two Thousand Two Hundred Thirty Six And Fifty Paise Only</Text>
                <Text>Bill Amount: Four Thousand Six Hundred Sixty Two Only</Text>
                <Text>Grand Total: ₹ 37,250.50</Text>
            </View>

            {/* Footer */}
            <View style={styles.section}>
                <Text style={styles.bold}>Terms & Conditions:</Text>
                <Text>1. Our risk and responsibility ceases as soon as the goods leave our premises.</Text>
                <Text>2. Interest @18% p.a. will be charged if payment is not made within due date.</Text>
                <Text>3. Goods once sold will not be taken back.</Text>
                <Text>4. "Subject to 'PORBANDAR' Jurisdiction only. E.&O.E"</Text>
            </View>

            <View style={styles.row}>
                <Text>For, Vaistra Technology</Text>
                <Text>Authorized Signature</Text>
            </View>
        </Page>
    </Document>
);

const PreviewInvoicePDF: FC<any> = ({ invoiceData }) => {

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <PDFViewer width="100%" height="100%">
                <InvoicePDF />
            </PDFViewer>
        </div>
    );
}

export default PreviewInvoicePDF