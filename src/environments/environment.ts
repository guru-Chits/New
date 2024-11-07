
const baseUrl = 'http://13.127.210.25';
const staging ='https://staging.guruchits.com'
const localUrl='http://localhost:8000'
const ren='https://chitfundapi.onrender.com'
export const environment = {
    paymentServiceUrl: `${ren}/api`,
    subscriberServiceUrl:`${staging}/api`,
    chitServiceUrl:`${ren}/api`,
    staffServiceUrl:`${staging}/api`,
    areaServiceUrl:`${staging}/api`,
    loginServiceUrl:`${staging}/api`,
    accessServiceUrl:`${staging}/api`,
    auctionServiceUrl:`${ren}/api`,
    settingsServiceUrl:`${staging}/api/settings`

}