import axios from 'axios';
import credentials from './credentials';

/**
 * Performs a POST network call to submit a new `invoice` resource.
 * See [API docs](https://fattmerchant.docs.apiary.io/#reference/0/invoices/create-an-invoice).
 * @param lineItems the line items charged on the invoice
 * @param tax the tax calculated for taxable line items
 * @param subtotal subtotal of all lineitems
 * @param total invoice total
 * @returns The response from the Fattmerchant API.
 */
async function postInvoice(selectedLineItems, tax, subtotal, total) {
  // Filter out line item properties not explicitly mentioned in API docs.
  const lineItems = selectedLineItems.map(
    ({ id, item, details, quantity, price }) => ({
      id,
      item,
      details,
      quantity,
      price,
    })
  );
  console.log(lineItems, tax, subtotal, total);
  const response = await axios({
    url: '/invoice',
    method: 'POST',
    baseURL: 'https://apidemo.fattlabs.com/',
    headers: {
      'Content-Type': 'application/json',
      Authorization: credentials.token,
      Accept: 'application/json',
    },
    data: {
      meta: {
        tax,
        subtotal,
        lineItems,
      },
      total,
      // hardcoded POST values
      customer_id: '03fd1f84-be3f-48ac-b460-2ad4bcc0689f',
      send_now: false,
      url: 'https://omni.fattmerchant.com/#/bill/',
    },
  });
  return response;
}

export default postInvoice;
