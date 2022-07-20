class Order {
    constructor(order_id, user, file_id, file_path, price, binding, lamination, page_orientation, colour, pages, payment_status) {
            this.order_id = order_id;
            this.user = user;
            this.file_id = file_id;
            this.file_path = file_path;
            this.price = price;
            this.binding = binding;
            this.lamination = lamination;
            this.page_orientation = page_orientation;
            this.colour = colour; 
            this.pages = pages;
            this.payment_status = payment_status;
    }
}

module.exports = Order;