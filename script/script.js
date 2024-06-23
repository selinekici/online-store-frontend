$(function () {
    var $products = $('#products');
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8001/products',
        success: function (products) {

            $.each(products, function (i, product) {
                var contDiv = $('<div id="' + product._id + '">');
                $(contDiv).click(function () {
                        var prodDetail = $('<div>  </div>');
                        var descriptionDiv = $('<div>  </div>').append('<strong>' + product.name + ' <small><br> ' + product.details + ' <br><strong>  ' +
                            '$' + product.price + '<small><br> Manifacturer: ' + product.manufacturer);
                        $(product.name).css('font-size', '30px');
                        var btn = $('<button> Add Cart </button>').click(function () {
                            let cartId = getUserId();
                            let quantity = 1;
                            $.ajax({
                                type: 'POST',
                                url: 'http://localhost:8001/cart/' + cartId,
                                data: JSON.stringify({productId: product._id, quantity: quantity}),
                                contentType: "application/json",
                                dataType: 'json',
                                success: function (response) {
                                    alert("Your order is in the shopping cart.");
                                },
                                error: function (xhr, status, error) {
                                    var errorMessage = xhr.responseJSON.message;
                                    alert(errorMessage);
                                }
                            });
                        });
                        var id = contDiv.attr('id');
                        $.ajax({
                            type: 'GET',
                            url: 'http://localhost:8001/products/' + id,
                            success: function (product) {
                                var img = $('<img>').attr({
                                    src: product.imageUrl,
                                    width: 550, // Set the image width
                                    height: 550 // Set the image height
                                });
                                prodDetail.append(img);
                                img.css({'display': 'inline-block'});
                                prodDetail.append(descriptionDiv);
                                descriptionDiv.css({'margin-top': '20px', 'display': 'inline-block', 'font-size': '20px'});
                                prodDetail.append(btn);
                                prodDetail.css({'display': 'inline-block'});
                                btn.css({
                                    'background-color': '#CC2C2CFF',
                                    'border-color': '#CC2C2CFF',
                                    'border-radius': '25px',
                                    'color': 'white',
                                    'width': '150px',
                                    'height': '50px',
                                    'margin-top': '20px',
                                    'display': 'inline-block'
                                });
                            }
                        })
                        $('#products-container').empty().append(prodDetail);
                        $(window).scrollTop($('#products-container').offset().top);

                    }
                );

                var img = $('<img>').attr({
                    src: product.imageUrl,
                    width: 250, // Set the image width
                    height: 250 // Set the image height
                });
                var div = $('<div>').css({'font-size': '15px', 'text-align': 'center'})
                    .append(product.name + ' <br><strong>  $' + product.price);
                contDiv.append(img).append(div);
                $products.append(contDiv);

            });
        }
    });
});


$('#products').css("flex-wrap", "wrap");

//register
$('#registerButton').click(function () {
    console.log("clicked");
    var email = $('#registerEmail').val();
    var password = $('#registerPassword').val();
    var address = $('#registerAddress').val();
    var firstname = $('#registerFirstname').val();
    var lastname = $('#registerLastname').val();
    var object = {email: email, password: password, address: address, firstname: firstname, lastname: lastname};
    console.log(object);
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8001/register',
        data: JSON.stringify(object),
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            alert("You created the account. You can go to log in.");
            window.location.href = "login.html";
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.responseJSON.message;
            alert(errorMessage);
        }
    });
});


//login
$('#loginButton').click(function () {
    var email = $('#loginEmail').val();
    var password = $('#loginPassword').val();
    var login = {email: email, password: password}
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8001/login',
        data: JSON.stringify(login),
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            alert("You are in the account successfully!!");
            setData('user', JSON.stringify({email: email, _id: response._id, isLoggedIn: true}));
            console.log('getData:' + JSON.parse(getData('user')));
            window.location.href = "index.html";

        },
        error: function (xhr, status, error) {
            var errorMessage = "You have not an account, You can register.";
            alert(errorMessage);
        }
    });
});


$('#logoutButton').click(function () {
    var email = getEmail();
    if (email) {
        console.log('logout clicked');
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8001/logout',
            data: JSON.stringify({email: email}),
            contentType: "application/json",
            dataType: 'json',
            success: function (response) {
                clearData();
                window.location.href = "index.html";
            },
            error: function (xhr, status, error) {
                console.log('errors: ' + status);
                console.log('errors: ' + error);
            }
        });
    }
});

$(document).ready(isLoggedIn);

function isLoggedIn() {
    var user = getData('user');
    console.log('user: ' + user);

    if (user) {
        user = JSON.parse(user);
        if (user.isLoggedIn) {
            $('#logoutButton').show();
        }

    } else {
        $('#logoutButton').hide();
    }
}

function getEmail() {
    var user = getData('user');
    console.log('user: ' + user);

    if (user) {
        user = JSON.parse(user);
        return user.email;

    } else {
        return null;
    }
}

function getUserId() {
    var user = getData('user');
    console.log('user: ' + user);

    if (user) {
        user = JSON.parse(user);
        return user._id;

    } else {
        return null;
    }
}

function getData(key) {
    var data = localStorage.getItem(key);
    if (data === null) {
        return false;
    } else {
        return data;
    }
}

function setData(key, value) {
    if (key === undefined || value === undefined) {
        return false;
    } else {
        localStorage.setItem(key, value);
        return true;
    }
}

function clearData() {
    localStorage.clear();
}

$('#womanbtn').click(function () {
    console.log("women clicked");
    var $products = $('#products');
    $products.empty();
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8001/products-by-category/women',
            success: function (products) {
                processProducts(products);
            },
            error: function (xhr, status, error) {
                console.log("ERROR");
            }
        });
});

$('#manbtn').click(function () {
    console.log("women clicked");
    var $products = $('#products');
    $products.empty();
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8001/products-by-category/man',
        success: function (products) {
            processProducts(products);
        },
        error: function (xhr, status, error) {
            console.log("ERROR");
        }
    });
});

$('#kidsbtn').click(function () {
    console.log("women clicked");
    var $products = $('#products');
    $products.empty();
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8001/products-by-category/kids',
        success: function (products) {
            processProducts(products);
        },
        error: function (xhr, status, error) {
            console.log("ERROR");
        }
    });
});
function processProducts(products) {
    var $products = $('#products');
    $products.empty();

    console.log("products; ", JSON.stringify(products));
    $.each(products, function (i, product) {
        var contDiv = $('<div id="' + product._id + '">');
        $(contDiv).click(function () {
                console.log('click');
                var prodDetail = $('<div>  </div>');
                var descriptionDiv = $('<div>  </div>').append('<strong>' + product.name + ' <small><br> ' + product.details + ' <br><strong>  ' +
                    '$' + product.price + '<small><br> Manifacturer: ' + product.manufacturer);
                $(product.name).css('font-size', '30px');
                var btn = $('<button> Add Card </button>').click(function () {
                    let cartId = getUserId();
                    let quantity = 1;
                    $.ajax({
                        type: 'POST',
                        url: 'http://localhost:8001/cart/' + cartId,
                        data: JSON.stringify({productId: product._id, quantity: quantity}),
                        contentType: "application/json",
                        dataType: 'json',
                        success: function (response) {
                            alert("Your order is in the shopping cart.");
                        },
                        error: function (xhr, status, error) {
                            var errorMessage = xhr.responseJSON.message;
                            alert(errorMessage);
                        }
                    });
                });
                var id = contDiv.attr('id');
                $.ajax({
                    type: 'GET',
                    url: 'http://localhost:8001/products/' + id,
                    success: function (product) {
                        var img = $('<img>').attr({
                            src: product.imageUrl,
                            width: 550, // Set the image width
                            height: 550 // Set the image height
                        });
                        prodDetail.append(img);
                        img.css({'display': 'inline-block'});
                        prodDetail.append(descriptionDiv);
                        descriptionDiv.css({'margin-top': '20px', 'display': 'inline-block', 'font-size': '20px'});
                        prodDetail.append(btn);
                        prodDetail.css({'display': 'inline-block'});
                        btn.css({
                            'background-color': '#CC2C2CFF',
                            'border-color': '#CC2C2CFF',
                            'border-radius': '25px',
                            'color': 'white',
                            'width': '150px',
                            'height': '50px',
                            'margin-top': '20px',
                            'display': 'inline-block'
                        });
                    }
                })
                $('#products-container').empty().append(prodDetail);
                $(window).scrollTop($('#products-container').offset().top);

            }
        );

        var img = $('<img>').attr({
            src: product.imageUrl,
            width: 250, // Set the image width
            height: 250 // Set the image height
        });
        var div = $('<div>').css({'font-size': '15px', 'text-align': 'center'})
            .append(product.name + ' <br><strong>  $' + product.price);
        contDiv.append(img).append(div);
        $products.append(contDiv);

    });
}



$('#shopping-cart').click(function () {
    var body = $('#body').empty();
    var cart = $('#body').append('<div> <br><br><br><br><br><br><br> </div>');
    body.append(cart);
    console.log("clicked");

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8001/cart/' + getUserId(),
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            const products = response.products;
            console.log("products: " + JSON.stringify(products));
            let productsIds = $.map(products, function (val, i) {
                return val.productId;
            })
            console.log("productIds: "+ productsIds);
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8001/products-by-ids',
                data: JSON.stringify(productsIds),
                contentType: "application/json",
                dataType: 'json',
                success: function (productDetails) {
                    let totalPrice = 0;
                    console.log("produc detaul:" + JSON.stringify(productDetails));
                    $.each(products, function (i, product) {
                        console.log("productid:" +product._id);
                       let productDetail ;
                       for (let i = 0; i < productDetails.length; i++){
                           if(productDetails[i]._id === product.productId){
                               productDetail = productDetails[i];
                               console.log("found productDetail" + productDetail);
                               break;
                           }
                       }
                       console.log("productDetail: "+ productDetail);
                        var containerDiv = $('<div id="' + product._id + '"> </div>');
                        var img = $('<img>').attr({
                            src: productDetail.imageUrl,
                            width: 150, // Set the image width
                            height: 150 // Set the image height
                        });

                        containerDiv.append(img);
                        var descriptionDiv = $('<div>  </div>').append('<strong>' + productDetail.name + ' <small><br> ' + productDetail.details + ' <br><strong>  ' +
                            '$' + productDetail.price + '<br>' + 'quantity: ' + product.quantity);
                        var removeButton = $('<button id="' + product.productId +' "> remove </button>');
                        $(removeButton).click(function () {
                            let id = removeButton.attr('id');
                            $.ajax({
                                type: 'DELETE',
                                url: 'http://localhost:8001/cart/remove-product/' + getUserId() + '/' + id,
                                contentType: "application/json",
                                dataType: 'json',
                                success: function () {
                                    $('#shopping-cart').trigger("click");
                                }
                            });
                        });
                        containerDiv.append(descriptionDiv);
                        cart.append(containerDiv);
                        cart.append(removeButton);
                        totalPrice += productDetail.price * product.quantity;
                    });
                    let total = $('<div> Total Price: '+ totalPrice + '</div>');
                    cart.append(total);
                }

            })
        },
        error: function (xhr, status, error) {
            var errorMessage = xhr.responseJSON.message;
            console.log("ERROR");
            alert(errorMessage);
        }
    });
});