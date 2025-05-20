import Transaction from './../models/transactionModel.js';
export const handlePayment = async (req,res) => {
    try {
        const body = req.body;
        // console.log(body);
        const orderId = body.order_id;
        switch(body.transaction_status){
            case 'capture' :
            case 'settlement' :
                await Transaction.findByIdAndUpdate(orderId, {status : 'success'});
                break;
            case 'deny' :
            case 'cancel' :
            case 'expire' :
            case 'failure' :
                await Transaction.findByIdAndUpdate(orderId, {status : 'failed'});
                break;
            default :
                break;
        }
        return res.json({message : "handle payment success", data : {}});
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}