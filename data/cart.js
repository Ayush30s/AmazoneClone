// stores product that will be added to cart at line no. 88 amazon.js
// export make this file to be get accessed outside this file by the 
// file whose type is module in this case amazon.js has type = "module"
// so it can access it using import keyword

//Json.parse to convert value of cart key back to array of object from string type
export let cart = JSON.parse(localStorage.getItem('cart'));

if(!cart) {
    cart = [{
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: '1'
    } , {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionId: '2'
    }];
}

export function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
    //check if the productName is already in the cart
    //below varaible to store th whole product to have access to all of its property nit just its name
    let matchingItem;
    cart.forEach((cartItem) => {
        if(productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    });

    //Exercise 13a-13e
    const selector = document.querySelector(`.js-quantity-selector-${productId}`); //getting value from selector
    const quantitySelected = Number(selector.value); //convert into number bcoz querySelector return string

    //if the product is insdie the cart increase its quantity by 1
    if(matchingItem) {
        matchingItem.quantity += quantitySelected; // increase quantity by quantitySelected amount
    }
    else {
        //if the product not found in the cart then, product added to cart with its name and quantity = 1
        cart.push({
            productId: productId,
            quantity: quantitySelected,
            deliveryOptionId: '1'
        });
    }

    //whenever we update our cart we call the below function
    //to save our changes to local storage
    saveToStorage();
}

export function removeFromCart(productId) {
    // step1> create a new Array
    // step2> loop through the cart
    // step3> add each product to the new array, except for this productId
    
    //step1
    const newCart = [];
    
    //step2
    cart.forEach((cartItem) => {

        //step3
        if(cartItem.productId !== productId) {
            newCart.push(cartItem);
        } else {

            // remove the item to be removed from total cartquantity and
            let removeProQunt = cartItem.quantity;
            let cartQuantity = localStorage.getItem('q');

            // save the change in cart quantity to local storage
            localStorage.setItem('q' , Number(cartQuantity-removeProQunt) < 0 ? 0 : Number(cartQuantity-removeProQunt));
        }
    });

    let cartQuantity = localStorage.getItem('q');
    document.querySelector('.js-home-link')
        .innerHTML = `${cartQuantity} Items`;

    //we also updated the cart to newcart
    cart = newCart;

    saveToStorage();
} 

export function updateDeliveryOption(productId , deliveryOptionId) {
    //  craete a var to store the product having
    //  same id as passed by productId parameter
    let matchingItem;

    //  iterate over cart and for each cartItem check if its productId
    //  is equal that of which we clicked to change its delivery date,
    //  if we  get that  product we store it in the matchinItem variable

    cart.forEach((cartItem) => {
        if(productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    });

    //  change the matchingitem initial deliveryOption
    //  to that passed as in above parameter 
    matchingItem.deliveryOptionId = deliveryOptionId;

    //  save the changes to storage
    saveToStorage();
}