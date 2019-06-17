import React from 'react';
import { Toast as RSToast, ToastHeader, ToastBody } from 'reactstrap';
import './Toast.css';

/**
 * A toast to notify the user about changes in the status of application data.
 */
function Toast(props) {
  const { toastStatus, closeToast } = props;

  let isOpen;
  let toastContents;
  switch (toastStatus) {
    case 'closed':
      isOpen = false;
      toastContents = null;
      break;
    case 'opened.postsuccess':
      isOpen = true;
      toastContents = (
        <>
          <ToastHeader icon="primary" toggle={closeToast}>
            Invoice Creator
          </ToastHeader>
          <ToastBody>Your invoice was created successfully.</ToastBody>
        </>
      );
      break;
    case 'opened.postfail':
      isOpen = true;
      toastContents = (
        <>
          <ToastHeader icon="danger" toggle={closeToast}>
            Invoice Creator
          </ToastHeader>
          <ToastBody>Error: Your invoice could not be created.</ToastBody>
        </>
      );
      break;
    // no default
  }
  return (
    <div aria-live="polite" aria-atomic="true" className="toast-container">
      <RSToast aria-live="assertive" aria-atomic="true" isOpen={isOpen}>
        {toastContents}
      </RSToast>
    </div>
  );
}

export default Toast;
