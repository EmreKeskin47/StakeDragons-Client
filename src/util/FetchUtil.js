import React from 'react';
import { toast } from 'react-toastify';
import ToastContent from 'components/ToastContent';

export const showSuccessToast = (title, description) => {
    toast(<ToastContent variant='success' manualTitle={title} description={description} />)
}

export const showFailToast = (title, description) => {
    toast(<ToastContent variant='fail' manualTitle={title} description={description} />)
}

export const showBroadcastingToast = (title, description) => {
    toast(<ToastContent variant='broadcasting' manualTitle={title} description={description} />)
}

export const showPromiseToast = (promise, resolveConditionMapper) => {
    toast.promise(promise, {
        pending: {
            render() {
                return <ToastContent variant='broadcasting' />
            },
            icon: false
        },
        success: {
            render({ data }) {
                if (resolveConditionMapper && !resolveConditionMapper(data)) {
                    return <ToastContent variant='fail' txHash={data} />
                }
                return <ToastContent variant='success' txHash={data} />
            },
            icon: false
        },
        error: {
            render({ data }) {
                return <ToastContent variant='fail' txHash={data} />
            },
            icon: false
        },
    })
}

export const showInsufficientFailToast = (errorMessage, token = 'DRGN') => {
    const isAmountError = errorMessage.includes("Overflow: Cannot Sub with") || errorMessage.includes("insufficient funds");
    showFailToast('Transaction Failed', isAmountError ? `Insufficient ${token} Amount` : 'Transaction Rejected')
}

const createEventListener = (promise) => function (e) {
    if (e.data?.type === 'proxy-request-response' && e.data?.result?.return?.signature) {
        showPromiseToast(promise);
    }
}

export const fetchWithToast = (promise) => {
    const keplrMessageListener = createEventListener(promise);
    window.keplr.eventListener.addMessageListener(keplrMessageListener)
    promise.then(res => res).catch(err => err).finally(() => {
        window.keplr.eventListener.removeMessageListener(keplrMessageListener)
    })
    return promise;
}