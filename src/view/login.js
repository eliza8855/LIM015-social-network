import { loginEmail, loginGoogle } from "../firebase/fb-functions.js";
import { saveUser } from "../firebase/fb-firestore.js";
const viewLogin = () => {
  const htmlLogin =/*html*/ `
  <div class="viewDesktop" >

     <div class="container__logoDesktop">
    <img class="viewDesktop__logo" src="./img/logoMobilPrueba.png" alt="Makipura">
    </div>

    <div class="container__logoDesktopWoman">
    <img class="viewDesktop__woman" src="./img/woman.png" alt="Makipura">
    </div>

  </div>
  <div class="login">
    <div class="logo">
      <img class="logo__img" src="./img/logoMobilPrueba.png" alt="Makipura" >
    </div>
    <div class="login__Subtitle">
      <h2 class="login__h2">¡Bienvenida Emprendedora!</h2>
    </div>
    <div class="login__title">
      <h1 class="login__h1">INICIA SESIÓN</h1>
    </div>
    <span id="errorLogin" ></span>
    <form class="form form--login" id="loginForm-login" action="">
      <div class="form--login__inputList">
        <div class="form--login__email inputList-item">
          <label type="" for="emailLogin" class="form--login__label">Email</label>
          <span class="icon icon--check"><i id="checkIcon" class="fas" ></i></span>
          <input type="text" class="form__input" id="emailLogin" placeholder="Ingrese su correo electrónico" required>          
        </div>
        <span id="statusEmailMessage"></span>
        <div class="inputList-item form--input__passwordLogin">
          <label type="" for="passwordLogin" class="form--login__label">Contraseña</label>
          <span class="icon icon--eye"><i id="checkEye" class="fas fa-eye-slash"></i></span>
          <input type="password" class="form__input" id="passwordLogin" value placeholder="Ingrese su contraseña" autocomplete="off" required>          
        </div>
        
      </div>
      <div class="form--login__button">
        <input class="button button--main button--login" type="submit" value="Ingresar">
      </div>
      <div class="form--separator form--login__separator">ó</div>
      <div class="form--login__social">
        <button id="buttonGoogleLogin" class="button button--second button--login" type="submit"> 
          <div class="buttton button--second__img "><img class="googleIcon" src="./img/iconoGoogle.png" alt="icono_Google"></div>
          <div class="buttton button--second__text">Ingresar con Google</div> 
        </button>
      </div>
    </form>
    <div class="login__registerLink">
      <p>¿No tienes cuenta?</br>Registrate<a class="link" href="#/register"> aquí</a></p>
    </div>
  </div>
    `;

  const sectionLogin = document.createElement("section");
  sectionLogin.classList.add("loginSection");
  sectionLogin.innerHTML = htmlLogin;

  const loginForm = sectionLogin.querySelector("#loginForm-login");
  //const errMessage =sectionLogin.querySelector('#errorEmailLogin');
  const emailLogin = sectionLogin.querySelector("#emailLogin");
  const spanEmail = sectionLogin.querySelector("#statusEmailMessage");
  const spanErrorLogin = sectionLogin.querySelector("#errorLogin");
  const divForm = sectionLogin.querySelector(".form__input");
  const iconEyeBox = sectionLogin.querySelector(".icon--eye");
  const iconEye = sectionLogin.querySelector("#checkEye");
  const iconCheck = sectionLogin.querySelector("#checkIcon");
  const passwordLogin = sectionLogin.querySelector("#passwordLogin");

  emailLogin.addEventListener("keyup", () => {
    const regEx = /^([\da-z_.-]+)@([\da-z]+)\.([a-z]{2,6})$/gim;

    if (regEx.test(emailLogin.value)) {
      spanEmail.classList.add("validateEmail");
      spanEmail.classList.remove("invalidEmail");
      spanEmail.innerHTML = "Correo correcto";
      divForm.style.borderColor = "green";
      iconCheck.classList.add("fa-check");
      iconCheck.classList.remove("fa-times");
    } else {
      spanEmail.classList.remove("validateEmail");
      spanEmail.classList.add("invalidEmail");
      spanEmail.innerHTML = "Ingrese un correo válido";
      divForm.style.borderColor = "red";
      iconCheck.classList.remove("fa-check");
      iconCheck.classList.add("fa-times");
    }
    if (emailLogin.value == "") {
      spanEmail.classList.remove("validateEmail");
      spanEmail.classList.remove("invalidEmail");
      spanEmail.innerHTML = "";
      divForm.style.borderColor = "#5c1331e8";
      iconCheck.classList.remove("fa-check");
      iconCheck.classList.remove("fa-times");
    }
  });

  iconEyeBox.addEventListener("click", () => {
    if (passwordLogin.type === "password") {
      passwordLogin.type = "text";
      iconEye.classList.remove("fa-eye-slash");
      iconEye.classList.add("fa-eye");
    } else {
      passwordLogin.type = "password";
      iconEye.classList.add("fa-eye-slash");
      iconEye.classList.remove("fa-eye");
    }
  });
  //SignIn With Email and Password Function
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailLogin = document.querySelector("#emailLogin").value;
    const passwordLogin = document.querySelector("#passwordLogin").value;
    //SignIn With Email and Password Function
    loginEmail(emailLogin, passwordLogin)
      .then((userCredential) => {
        console.log("121",userCredential.additionalUserInfo.profile);
        //clear form
        loginForm.reset();
        // changeLogin();
        firebase.auth().onAuthStateChanged((user) => {
          console.log("128",user.additionalUserInfo);
          // changeLogin();
          if(user.emailVerified){
            
            window.open("#/home", "_self");
          }else {
            //
          }
        })  
      })
      .catch(() => {
        spanErrorLogin.classList.add("errorLogin");
        spanErrorLogin.classList.add("invalidEmail");
        spanErrorLogin.innerHTML =
          "Usuario y/o contraseña no existen, vuelta a intentarlo nuevamente";
      });
    setTimeout(function () {
      spanErrorLogin.classList.remove("errorLogin");
      spanErrorLogin.classList.remove("invalidEmail");
      spanErrorLogin.innerHTML = "";
    }, 2000);

  });

  const buttonGoogleLogin = sectionLogin.querySelector("#buttonGoogleLogin");
  buttonGoogleLogin.addEventListener("click", () => {
    loginGoogle()
      .then((userCredential) => {
        const newUser = userCredential.additionalUserInfo.isNewUser;
        
        if (newUser){
          const uId = userCredential.user.uid;
          const uName = userCredential.additionalUserInfo.profile.given_name;
          const uLastname = userCredential.additionalUserInfo.profile.family_name;
          const uPhoto = userCredential.additionalUserInfo.profile.picture;
          const uEmail=userCredential.user.email
          const uPhone="999 999 999";
          const uCompany="Mi Empresa SAC";
          const uLocation="Distrito, Departamento, Perú";
          const uDescription="Describe tu emprendimiento";
  
          const userProfile = {
           userId : uId,
           userName: uName.toLowerCase(),
           userLastname: uLastname.toLowerCase(),
           userPhoto: uPhoto,
           userEmail:uEmail,
           userPhone:uPhone,
           userCompany:uCompany,
           userLocation:uLocation,
           userDescription:uDescription
  
          };
          saveUser(userProfile);
        }
        window.open("#/home", "_self");
      })
      .catch((error) => {
        console.log(error);
      });
  });


  return sectionLogin;
};
// window.history.go(0)

      

export { viewLogin };
