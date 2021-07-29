const navToggler=document.querySelector(".nav-toggler");
navToggler.addEventListener("click", ()=>{
    hideSection();
    toggleNavbar();
    document.body.classList.toggle("hide-scrolling");
})
function hideSection(){
    document.querySelector("section.active").classList.toggle("fade-out")
}


document.addEventListener("click", (e)=>{
    if(e.target.classList.contains("link-item") && e.target.hash !==""){
        document.querySelector(".overlay").classList.add("active")
        if(e.target.classList.contains("nav-item")){
            toggleNavbar();
        }
        else{
            hideSection();
        }
        setTimeout(()=>{
            document.querySelector("section.active").classList.remove("active","fade-out");
            document.querySelector(e.target.hash).classList.add("active");
            window.scrollTo(0,0);
            document.body.classList.remove("hide-scrolling");
            document.querySelector(".overlay").classList.remove("active")
        },100)
    }
})
function toggleNavbar(){
    document.querySelector(".header").classList.toggle("active")
}
const icontoggler=document.querySelector(".icon");
icontoggler.addEventListener("click",()=>{
    document.body.classList.toggle("dark-theme");
    document.getElementById("sun").classList.toggle("hidedisplay")
    document.getElementById("moon").classList.toggle("hidedisplay")
})
