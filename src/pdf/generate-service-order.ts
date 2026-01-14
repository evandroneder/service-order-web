import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import type { ServiceOrder } from '../models/service-order.interface';
import { serviceOrderPdfTemplate } from './service-order-template';

// async function imageToBase64(url: string): Promise<string> {
//   const response = await fetch(url);
//   const blob = await response.blob();

//   return new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result as string);
//     reader.readAsDataURL(blob);
//   });
// }

export async function generateServiceOrderPDF(order: ServiceOrder) {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.width = '210mm';
  iframe.style.height = '297mm';
  iframe.style.left = '-9999px';

  document.body.appendChild(iframe);

  // let logoBase64 = '';

  // if (order.company?.logo_url) {
  //   try {
  //     logoBase64 = await imageToBase64(order.company.logo_url);
  //   } catch {
  //     logoBase64 = '';
  //   }
  // }

  const doc = iframe.contentDocument!;
  doc.open();
  doc.write(serviceOrderPdfTemplate(order));
  doc.close();

  await new Promise((resolve) => setTimeout(resolve, 300));

  const canvas = await html2canvas(doc.body, {
    useCORS: true,
    allowTaint: false,
    ignoreElements: (el) => el.tagName === 'IMG',
  });

  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgData = canvas.toDataURL('image/png');

  pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
  const fileName = order.client.name.replaceAll(' ', '_');
  const today = moment().format('DD/MM/YYYY');
  pdf.save(`${fileName}_${today}_OS_${order.id_service_order}.pdf`);

  document.body.removeChild(iframe);
}
