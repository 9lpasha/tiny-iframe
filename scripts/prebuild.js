process.env['PUBLIC_URL'] = process.env['TINYMCE_URL'] ? process.env['TINYMCE_URL'] : 'https://support.happydesk.ru/test-tinymce';

console.log(process.env['TINYMCE_URL']);
console.log(process.env['PUBLIC_URL'])