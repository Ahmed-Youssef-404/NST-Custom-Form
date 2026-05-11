export const finalSend = async (formData: any) => {
    return fetch('https://script.google.com/macros/s/AKfycby9MzHcHHudz54qfpp-xIJh4XBu19hpP4wnbFHMY-1QeFHrJRPj0pIIlx49X06F7BCH/exec', {
    // return fetch('https://script.google.com/m...4XBu19hpP4wnbFHMY-1QeFHrJRPj0pIIlx49X06F7BCH/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', // جوجل يفضل هذا النوع أحياناً لتجنب Preflight
        },
        body: JSON.stringify(formData),
    }).catch(err => {
        // إذا كان الخطأ بسبب CORS فقط والبيانات وصلت، جوجل لا يعطي رد مقروء
        // لكن لو النت مقطوع مثلاً سيعطي خطأ حقيقياً
        console.warn("CORS limitation might be active, but data usually sent.", err);
    });
};