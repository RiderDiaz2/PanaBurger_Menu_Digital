/* =========================================================
   CONFIGURACIÓN DEL RESTAURANTE
   ========================================================= */
const RESTAURANT_INFO = {
  name: "PanaBurger",
  location: "Estado Aragua, Venezuela",
  address: "C. Bolivar , Estado Aragua, Venezuela",
  timezone: "America/Caracas",  // Usado para calcular "Abierto Ahora"
  // 0 = Domingo ... 6 = Sábado. Formato 24 horas "HH:MM".
  hours: {
    0: { open: "17:00", close: "23:00" },
    1: { open: "17:00", close: "23:00" },
    2: { open: "17:00", close: "23:00" },
    3: { open: "17:00", close: "23:00" },
    4: { open: "17:00", close: "23:00" },
    5: { open: "17:00", close: "23:00" },
    6: { open: "17:00", close: "23:00" },
  },
};

/* =========================================================
   CATEGORÍAS ("all" es obligatoria para la pestaña por defecto)
   ========================================================= */
const MENU_CATEGORIES = [
  { id: "all", label: "Todos", icon: "✨" },
  { id: "burgers", label: "Hamburguesas", icon: "  " },
  { id: "hotdogs", label: "Perros Calientes", icon: "  " },
  { id: "lunches", label: "Almuerzos", icon: "  " },
  { id: "icecream", label: "Heladería", icon: "  " },
  { id: "drinks", label: "Bebidas", icon: "  " },
];

/* =========================================================
   AYUDANTE DE IMÁGENES
   Construye una URL de Unsplash optimizada a partir del ID de la foto.
   ========================================================= */
const unsplash = (photoId) =>
  `https://images.unsplash.com/${photoId}?w=800&q=80&auto=format&fit=crop`;

/* =========================================================
   PRODUCTOS DEL MENÚ
   Esquema: {
     id, name, category, price, description, ingredients[],
     image, rating, popular, available
   }
   ========================================================= */
const MENU_ITEMS = [
  // ---------- Hamburguesas ----------
  {
    id: "burger-classic-sheese",
    name: "Hamburguesa Clásica con Queso",
    category: "burgers",
    price: 8.99,
    description: "Carne Angus, cheddar añejo y salsa especial de la casa en pan brioche tostado.",
    ingredients: ["Carne Angus", "Cheddar añejo", "Lechuga", "Tomate", "Pepinillos", "Salsa de la casa", "Pan brioche"],
    image: unsplash("photo-1568901346375-23c9450c58cd"),
    rating: 4.8,
    popular: true,
    available: true,
  },
  {
    id: "burger-smoky-bbq",
    name: "Hamburguesa BBQ Ahumada",
    category: "burgers",
    price: 10.49,
    description: "Doble carne, tocino ahumado, aros de cebolla crocantes y salsa BBQ estilo hickory.",
    ingredients: ["Doble carne", "Tocino ahumado", "Aros de cebolla", "Salsa BBQ", "Queso cheddar", "Pan brioche"],
    image: unsplash("photo-1553979459-d2229ba7433b"),
    rating: 4.9,
    popular: true,
    available: true,
  },
  {
    id: "burger-truffle-mushroom",
    name: "Hamburguesa de Pollo Crispy",
    category: "burgers",
    price: 12.99,
    description: "Portobello a la parrilla, queso suizo, rúcula y alioli de trufa en pan de ajonjolí.",
    ingredients: ["Portobello a la parrilla", "Queso suizo", "Rúcula", "Alioli de trufa", "Pan de ajonjolí"],
    image:"images/hamburguesa-pollocrispy.jpg",
    rating: 4.7,
    popular: false,
    available: true,
  },
  {
    id:"burger-classic",
    name: "Hamburguesa Clásica",
    category: "burgers",
    price: 9.99,
    description: "Carne Angus, lechuga, tomate, cebolla y pepinillos en pan brioche tostado.",
    ingredients: ["Carne Angus", "Lechuga", "Tomate", "Cebolla", "Pepinillos", "Pan brioche"],
    image:"images/hamburguesa-clasica.jpg",
    rating: 4.6,
    popular: false,
    available: true,
  },

  // ---------- Perros Calientes ----------
  {
    id: "hotdog-chicago",
    name: "Perro Caliente Normal",
    category: "hotdogs",
    price: 6.5,
    description: "Salchicha de res con mostaza amarilla, relish, cebolla, tomate y pepinillo encurtido.",
    ingredients: ["Salchicha de res", "Mostaza amarilla", "Relish", "Cebolla", "Tomate", "Pepinillo encurtido", "Pan con semillas"],
    image:"images/perro-normal.jpeg",
    rating: 4.6,
    popular: false,
    available: true,
  },
  {
    id: "hotdog-chili-cheese",
    name: "Perro Especial",
    category: "hotdogs",
    price: 7.75,
    description: "Salchicha a la parrilla cubierta con chili de res, queso cheddar fundido y jalapeños.",
    ingredients: ["Salchicha a la parrilla", "Chili de res", "Queso cheddar fundido", "Jalapeños"],
    image:"images/perro-caliente-especial.jpeg",
    rating: 4.8,
    popular: true,
    available: true,
  },
  {
    id: "hotdog-bacon-wrapped",
    name: "Perro Caliente Americano",
    category: "hotdogs",
    price: 8.25,
    description: "Salchicha jumbo envuelta en tocino ahumado, con mayonesa sriracha y chalotes crocantes.",
    ingredients: ["Salchicha jumbo", "Tocino ahumado", "Mayonesa sriracha", "Chalotes crocantes"],
    image: "images/perro-caliente-americano.jpg",
    rating: 4.7,
    popular: false,
    available: true,
  },
  {
    id:"hotdog-mixed",
    name: "Perro Caliente Mixto",
    category: "hotdogs",
    price: 7.5,
    description: "Mezcla de salchichas de res y cerdo, con mostaza, relish y cebolla en pan con semillas.",
    ingredients: ["Salchicha de res", "Salchicha de cerdo", "Mostaza", "Relish", "Cebolla", "Pan con semillas"],
    image: "images/perro-caliente-mixto.jpeg",
    rating: 4.6,
    popular: false,
    available: true,
  },

  // ---------- Almuerzos ----------
  {
    id: "lunch-chicken-wrap",
    name: "Shawarma de Carne",
    category: "lunches",
    price: 9.99,
    description: "Pollo marinado en hierbas, lechuga romana, tomates cherry y yogur de ajo en tortilla de espinaca.",
    ingredients: ["Pollo marinado", "Lechuga romana", "Tomates cherry", "Yogur de ajo", "Tortilla de espinaca"],
    image: "images/shawarma.jpg",
    rating: 4.6,
    popular: false,
    available: true,
  },
  {
    id: "lunch-philly-cheesesteak",
    name: "Pechuga de Pollo en Salsa de Champiñones",
    category: "lunches",
    price: 11.5,
    description: "Ribeye finamente cortado, pimientos y cebollas salteadas, y queso provolone en pan hoagie.",
    ingredients: ["Ribeye finamente cortado", "Pimientos salteados", "Cebollas salteadas", "Queso provolone", "Pan hoagie"],
    image: "images/almuerzos.jpg",
    rating: 4.9,
    popular: true,
    available: true,
  },
  {
    id: "lunch-caesar-salad",
    name: "Ensalada César",
    category: "lunches",
    price: 8.75,
    description: "Lechuga romana crujiente, parmesano en láminas, crutones de ajo y aderezo César de la casa.",
    ingredients: ["Lechuga romana", "Parmesano en láminas", "Crutones de ajo", "Aderezo César"],
    image: "images/ensalada-cesar.jpeg",
    rating: 4.5,
    popular: false,
    available: true,
  },
  {
    id: "pasticcio",
    name: "Pasticho",
    category: "lunches",
    price: 10.99,
    description: "Un plato tradicional con carne molida, verduras y salsa de la casa.",
    ingredients: ["Carne molida", "Verduras", "Salsa de la casa"],
    image: "images/pasticho.jpg",
    rating: 4.7,
    popular: true,
    available: true,
  },

  // ---------- Heladería ----------
  {
    id: "ice-vanilla-bean",
    name: "Barquilla ",
    category: "icecream",
    price: 3.99,
    description: "Helado de vainilla de Madagascar, batido artesanalmente cada día. Disponible en copa o barquillo.",
    ingredients: ["Vainilla de Madagascar", "Crema fresca", "Azúcar de caña"],
    image: "images/barquilla-normal-heladeria.jpg",
    rating: 4.7,
    popular: false,
    available: true,
  },
  {
    id: "ice-chocolate-fudge",
    name: "Sundae de Chocolate y Fudge",
    category: "icecream",
    price: 6.49,
    description: "Dos bolas de helado de chocolate, fudge tibio, crema batida y una cereza encima.",
    ingredients: ["Helado de chocolate", "Fudge tibio", "Crema batida", "Cereza marrasquino"],
    image: "images/sundae-heladeria.jpg",
    rating: 4.9,
    popular: true,
    available: true,
  },
  {
    id: "ice-strawberry-cheesecake",
    name: "Banana Split",
    category: "icecream",
    price: 4.75,
    description: "Helado de fresa con remolino y trozos de galleta graham en un barquillo crocante.",
    ingredients: ["Helado de fresa", "Galleta graham", "Barquillo crocante"],
    image: "images/banana-split-heladeria.jpg",
    rating: 4.8,
    popular: false,
    available: true,
  },

   // ---------- Bebidas ----------
  {
    id: "drinks-coffee",
    name: "Café",
    category: "drinks",
    price: 2.99,
    description: "Café recién preparado con granos de alta calidad.",
    ingredients: ["Café", "Agua"],
    image: "images/cafe-bebidas.jpg",
    rating: 4.6,
    popular: true,
    available: true,
  },
  {
    id: "drinks-tea",
    name: "Té",
    category: "drinks",
    price: 2.49,
    description: "Té caliente, disponible en varias variedades.",
    ingredients: ["Té", "Agua"],
    image: "images/te-bebidas.jpg",
    rating: 4.5,
    popular: false,
    available: true,
  },
{
    id: "drinks-soda",
    name: "Refresco",
    category: "drinks", 
    price: 2.99,
    description: "Refresco de alta calidad, disponible en varias sabores.",
    ingredients: ["Agua", "Azúcar", "Saborizante"],
    image: "images/refresco-bebidas.jpg",
    rating: 4.3,
    popular: false,
    available: true,
  },
  {
    id: "drinks-smoothie",
    name: "Smoothie de Frutas",
    category: "drinks",
    price: 4.99,
    description: "Smoothie de frutas frescas, batido artesanalmente cada día.",
    ingredients: ["Frutas frescas", "Leche", "Miel"],
    image: "images/smoothie-bebidas.jpg",
    rating: 4.8,
    popular: true,
    available: true,
  },
  {
    id: "ice cream basket",
    name: "Cesta de Helados",
    category: "icecream",
    price: 12.99,
    description: "Una cesta con una selección de nuestros helados más populares.",
    ingredients: ["Helado de vainilla", "Helado de chocolate", "Helado de fresa"],
    image: "images/canasta-helado.jpg",
    rating: 4.9,
    popular: true,
    available: true,
  },
];
