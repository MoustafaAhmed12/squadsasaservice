import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseHeader } from '../../../shared/model/responseHeader';
import { environment } from '../../../../environments/environment';
import { Markets } from '../models/clients';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Injectable({
  providedIn: 'root',
})
export class ClientService {
  http = inject(HttpClient);
  allMarkets: Markets[] = [];

  // .pipe(
  //     tap(({ statusCode, data }: ResponseHeader) => {
  //       if (statusCode === 200) {
  //         this.doLoggedUser(data);
  //       }
  //     })
  //   );;

  getTechnologiesByAreaId(areaId: number): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Technologies/area/${areaId}`
    );
  }
  getProfilesByTechnologyId(technologyId: number): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/JobTitles/technology/${technologyId}`
    );
  }
  getAreasByTechnologyId(technologyId: number): Observable<ResponseHeader> {
    return this.http.get<ResponseHeader>(
      `${environment.BASE_URL}/api/Areas/technology/${technologyId}`
    );
  }
  confirmOrder(formData: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/Orders`,
      formData
    );
  }
  contactUs(formData: any): Observable<ResponseHeader> {
    return this.http.post<ResponseHeader>(
      `${environment.BASE_URL}/api/ContactUs`,
      formData
    );
  }

  async generatePdfFromData(
    data: any,
    profiles: any[],
    totalQuantity: number,
    totalPrice: number,
    period: number
  ): Promise<any> {
    const container = document.createElement('div');
    container.style.width = '210mm'; // A4 width
    container.style.padding = '20mm';
    container.style.background = '#f9f9f9'; // Light background color for the invoice
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.color = '#333'; // Dark text color for readability
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

    // Adding styles for the invoice header
    container.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="font-size: 26px; margin: 0; color: #333;">Invoice</h2>
      <p style="font-size: 24px; color: #666; margin: 5px 0;">Fiker - Order</p>
    </div>
    <div style="margin-bottom: 20px;">
      <p><strong style="color: #333;">Market:</strong> ${data.marketName}</p>
      <p><strong style="color: #333;">Area:</strong> ${data.areaName}</p>
      <p><strong style="color: #333;">Technology:</strong> ${data.techName}</p>
      <p><strong style="color: #333;">Period:</strong> ${period} Months</p>
    </div>
    <div style="margin-bottom: 20px;">
      <h3 style="font-size: 18px; color: #333;">Profiles</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr>
            <th style="border-bottom: 2px solid #ddd; padding: 8px; text-align: left; color: #333;">Profile Name</th>
            <th style="border-bottom: 2px solid #ddd; padding: 8px; text-align: right; color: #333;">Count</th>
          </tr>
        </thead>
        <tbody>
          ${profiles
            .map(
              (profile: any) => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #555;">${profile.jobTitle}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; color: #555;">${profile.quantity}</td>
              </tr>
            `
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <div style="margin-top: 20px; display: flex; justify-content: space-between; border-top: 2px solid #ddd; padding-top: 15px;">
      <p><strong style="color: #333;">Subtotal:</strong> ${totalQuantity} profiles</p>
      <p><strong style="color: #333;">Total Price:</strong> $${totalPrice.toFixed(
        2
      )}</p>
    </div>
  `;
    // Temporarily add the element to the DOM
    document.body.appendChild(container);

    // Generate the canvas
    const canvas = await html2canvas(container, { scale: 2 });

    // Clean up by removing the temporary container
    document.body.removeChild(container);

    // Convert canvas to image data
    const imageData = canvas.toDataURL('image/png');

    // Create a PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Use `pdf.output('blob')` instead of Base64
    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  }
}
