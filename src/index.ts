import Rubiks from "./rubiks/index";


window.onload = () => {
    const container = document.getElementById("container");
    const orderChangeEle = document.getElementById("order-select") as HTMLSelectElement;
    
    
    if (container) {
        const rubiks = new Rubiks(container);

        orderChangeEle.addEventListener("change", (event) => {
            const value = (event.target! as HTMLSelectElement).value;

            rubiks.setOrder(parseInt(value));
        })
    }
};
