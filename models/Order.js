class Order {
    constructor(created_at, order_id, user_id,  file_path, price, binding, lamination, page_orientation, colour,
         copies, payment_status, order_status) {
            this.created_at = created_at;
            this.order_id = order_id;
            this.user_id = user_id;
            this.priority = priority;
            this.file_path = file_path;
            this.price = price;
            this.binding = binding;
            this.lamination = lamination;
            this.page_orientation = page_orientation;
            this.colour = colour; 
            this.copies = copies;
            this.instructions = instructions;
            this.payment_status = payment_status;
            this.order_status = order_status;
    }
}

module.exports = Order;