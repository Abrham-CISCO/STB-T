let timeout;
let password = document.getElementById('PassEntry');
let submit =  document.getElementById('submit');
let submitForm = false;
let strengthBadge = document.getElementById('StrengthDisp');
let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')
function StrengthChecker(PasswordParameter) {
    if(strongPassword.test(PasswordParameter)) {
        strengthBadge.textContent = 'ጠንካራ የይለፍ ቃል';
        password.className = "form-control is-valid";
        submitForm = true;
    } else if(mediumPassword.test(PasswordParameter)) {
        strengthBadge.textContent = 'መካከለኛ የይለፍ ቃል';
        password.className = "form-control is-warning";
        submitForm = true;
    } else {
        strengthBadge.textContent = 'ደካማ የይለፍ ቃል';
        password.className = "form-control is-invalid";
    }
}
password.addEventListener("input", () => {
    strengthBadge.style.display = 'block';
    clearTimeout(timeout);
    timeout = setTimeout(() => StrengthChecker(password.value), 500);
    if(password.value.length !== 0) {
        strengthBadge.style.display != 'block';
    } else {
        strengthBadge.style.display = 'none';
    }
});
submit.addEventListener('click',function(event){
    if(!submitForm)
    {
        event.preventDefault();
    }
})