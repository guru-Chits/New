
const baseUrl = 'https://chitfundapi.onrender.com';
const localUrl='http://localhost:8000'
export const environment = {
    paymentServiceUrl: `${localUrl}/api`,
    subscriberServiceUrl:`${baseUrl}/api`,
    chitServiceUrl:`${baseUrl}/api`,
    staffServiceUrl:`${baseUrl}/api`,
    areaServiceUrl:`${baseUrl}/api`,
    loginServiceUrl:`${localUrl}/api`,
    accessServiceUrl:`${localUrl}/api`,
    auctionServiceUrl:`${baseUrl}/api`,
    settingsServiceUrl:`${localUrl}/api/settings`
}