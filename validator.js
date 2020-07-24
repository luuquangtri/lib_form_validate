// constructor function
function Validator(option) {

    var selectorRules = {};

    //hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(option.errorSelector);
        var errorMassage;
        var rules = selectorRules[rule.selector];

        // lập qua từng rules và kiểm tra
        // nếu có error thì lập tức dừng việc kiểm tra 
        for (let i = 0; i < rules.length; ++i) {
            errorMassage = rules[i](inputElement.value);
            if (errorMassage) break;
        }

        if (errorMassage) {
            errorElement.innerText = errorMassage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove('invalid');
        }

        return !errorMassage;
    }

    //lấy element form cần validate
    var formElement = document.querySelector(option.form);
    console.log(option.rules);
    if (formElement) {
        // xử lý lập qua mỗi rule và xử lý event...vv
        formElement.onsubmit = function (e) {
            e.preventDefault();
            var formSubmit = true;
            //lập qua từng rules và validate
            option.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    formSubmit = false;
                }
            })

            if (formSubmit) {

            }
        }



        option.rules.forEach(function (rule) {
            // lưu lại các rules cho mỗi input
            /**
             * check nếu nó không là array thì gán cho nó là 1 array, ở lần lập đầu tiên chắc chắn nó sẽ là undefined
             * lần thứ 2 nó có data, sẽ push data vào mảng vừa tạo
             */
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }


            // console.log(rule);
            var inputElement = formElement.querySelector(rule.selector);
            // console.log(inputElement);
            if (inputElement) {
                //xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    // console.log("blur", rule.selector);
                    validate(inputElement, rule);
                }
                //xử lý trường hợp mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(".form-message");
                    errorElement.innerText = "";
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        })

    }

}

//định nghĩa các rules
//nguyên tắc của các rule, khi có lỗi trả message lỗi, khi k lỗi k trả hoặc trả về undefined
Validator.isRequired = function (selector, message) {
    return {
        selector,
        test: function (value) {
            return value.trim() ? undefined : message || "vui lòng nhập trường này"
        }
    }
}

Validator.isEmail = function (selector, message) {
    return {
        selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || "trường này phải là email"
        }
    }
}

Validator.minLength = function (selector, min, message) {
    return {
        selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `vui lòng nhập tối thiểu ${min} ký tự`
        }
    }
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    }
}
// end rules