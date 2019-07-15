import mockResponse from './mockInvoiceResponse';

function postInvoice() {
  return new Promise(resolve => setTimeout(() => resolve(mockResponse), 1500));
}

export default postInvoice;
