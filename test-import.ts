// Test file to explore package exports
import apiClient from '@learningpad/api-client';
import * as apiClientModule from '@learningpad/api-client';

console.log('Default export:', apiClient);
console.log('Module exports:', Object.keys(apiClientModule));

export default {};