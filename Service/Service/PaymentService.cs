using Azure;
using Azure.Core;
using Service.Dto;
using Service.Model;
using Service.Util;

namespace Service.Service
{
    public class PaymentService(MyContext context, IWebHostEnvironment hostEnvironment)
    {
        protected MyContext context = context;
        protected IWebHostEnvironment hostEnvironment = hostEnvironment;
        public string CreatePaymentLink(Order order)
        {
            long orderId = DateTime.Now.Ticks;
            PaymentConfig paymentConfig = context.PaymentConfigs.First(x => x.IsProduction == false);
            //Get Config Info
            string vnp_Returnurl = "http://localhost:4200/gio-hang";
            string vnp_Url = paymentConfig.Url;
            string vnp_TmnCode = paymentConfig.TerminalId;
            string vnp_HashSecret = paymentConfig.SecretKey;

            VnPayLibrary vnpay = new VnPayLibrary();

            vnpay.AddRequestData("vnp_Version", VnPayLibrary.VERSION);
            vnpay.AddRequestData("vnp_Command", "pay");
            vnpay.AddRequestData("vnp_TmnCode", vnp_TmnCode);
            vnpay.AddRequestData("vnp_Amount", (order.TotalAmount * 100).ToString()); //Số tiền thanh toán. Số tiền không            

            vnpay.AddRequestData("vnp_BankCode", "VNBANK");

            vnpay.AddRequestData("vnp_CreateDate", order.Created.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", "VND");
            vnpay.AddRequestData("vnp_IpAddr", Utils.GetIpAddress());
            vnpay.AddRequestData("vnp_Locale", "vn");
            vnpay.AddRequestData("vnp_OrderInfo", "Thanh toan don hang:" + orderId);
            vnpay.AddRequestData("vnp_OrderType", "other"); //default value: other
            vnpay.AddRequestData("vnp_ReturnUrl", vnp_Returnurl);
            vnpay.AddRequestData("vnp_TxnRef", orderId.ToString()); // Mã tham chiếu của giao dịch tại hệ            
                                                                    //Add Params of 2.1.0 Version
            vnpay.AddRequestData("vnp_ExpireDate", order.Created.AddMinutes(30).ToString("yyyyMMddHHmmss"));           

            string paymentUrl = vnpay.CreateRequestUrl(vnp_Url, vnp_HashSecret);
            //log.InfoFormat("VNPAY URL: {0}", paymentUrl);
            //Response.Redirect(paymentUrl);
            return paymentUrl;
        }
        public string VerifyPayment(Dictionary<string, string> query)
        {
            
            PaymentConfig paymentConfig = context.PaymentConfigs.First(x => x.IsProduction == false);
            VnPayLibrary vnPay = new VnPayLibrary();

            foreach (string s in query.Keys)
            {
                //get all querystring data
                if (!string.IsNullOrEmpty(s) && s.StartsWith("vnp_"))
                {
                    vnPay.AddResponseData(s, query[s]);
                }
            }

            long orderId = Convert.ToInt64(query["vnp_TxnRef"]);
            long vnpayTranId = Convert.ToInt64(query["vnp_TransactionNo"]);
            string vnp_ResponseCode = query["vnp_ResponseCode"];
            string vnp_TransactionStatus = query["vnp_TransactionStatus"];
            String vnp_SecureHash = query["vnp_SecureHash"];
            String TerminalID = paymentConfig.TerminalId;
            long vnp_Amount = Convert.ToInt64(query["vnp_Amount"]) / 100;
            String bankCode = query["vnp_BankCode"];

            string displayMsg = "";
            string vnp_HashSecret = paymentConfig.SecretKey; //Chuoi bi mat
            bool checkSignature = vnPay.ValidateSignature(vnp_SecureHash, vnp_HashSecret);
            if (checkSignature)
            {
                if (vnp_ResponseCode == "00" && vnp_TransactionStatus == "00")
                {
                    //Thanh toan thanh cong
                    displayMsg = "1";
                    //log.InfoFormat("Thanh toan thanh cong, OrderId={0}, VNPAY TranId={1}", orderId, vnpayTranId);
                }
                else
                {
                    //Thanh toan khong thanh cong. Ma loi: vnp_ResponseCode
                    displayMsg = "2";
                    // log.InfoFormat("Thanh toan loi, OrderId={0}, VNPAY TranId={1},ResponseCode={2}", orderId, vnpayTranId, vnp_ResponseCode);
                }
                //displayTmnCode.InnerText = "Mã Website (Terminal ID):" + TerminalID;
                //displayTxnRef.InnerText = "Mã giao dịch thanh toán:" + orderId.ToString();
                //displayVnpayTranNo.InnerText = "Mã giao dịch tại VNPAY:" + vnpayTranId.ToString();
                //displayAmount.InnerText = "Số tiền thanh toán (VND):" + vnp_Amount.ToString();
                //displayBankCode.InnerText = "Ngân hàng thanh toán:" + bankCode;
            }
            else
            {
                //log.InfoFormat("Invalid signature, InputData={0}", Request.RawUrl);
                displayMsg = "2";
            }
            return displayMsg;
        }
    }
}
