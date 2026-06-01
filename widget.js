var url =
  "https://edna.io/wp-content/plugins/whatsapp-widget-generator/js/generator.js?14522";
var s = document.createElement("script");
s.type = "text/javascript";
s.async = true;
s.src = url;
var options = {
  host: "https://edna.io",
  enabled: true,
  chatButtonSetting: {
    backgroundColor: "#4fce5d",
    ctaText: "",
    icon: "whatsapp",
    position: "right",
  },
  brandSetting: {
    backgroundColor: "#085b53",
    brandImg: "https://ik.imagekit.io/stalyindev/KrakeDev/404.png",
    brandName: "Conta UI",
    brandSubTitle: "Normalmente responde en unos minutos",
    ctaText: "Comenzar chat",
    phoneNumber: "593963313195,593983782562",
    welcomeText: "Hola! 👋, Necesitas un asesor, escribenos.",
  },
};
s.onload = function () {
  CreateWhatsappChatWidget(options);
};
var x = document.getElementsByTagName("script")[0];
x.parentNode.insertBefore(s, x);
 
 