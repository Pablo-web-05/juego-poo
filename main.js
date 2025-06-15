class Game {
  constructor() {
    this.container = document.getElementById("game-container");
    this.puntosElement = document.getElementById("puntos");
    this.puntos1Element = document.getElementById("puntos1");
    this.personaje = null;
    this.personaje1 = null;
    this.monedas = [];
    this.puntuacion = 0;
    this.puntuacion1 = 0;

    this.crearEscenario();
    this.agregarEventos();
  }

  crearEscenario() {
    this.personaje = new Personaje(0);
    this.personaje1 = new Personaje(1);
    this.container.appendChild(this.personaje.element);
    this.container.appendChild(this.personaje1.element);

    for (let i = 0; i < 11; i++) {
      const moneda = new Moneda();
      this.monedas.push(moneda);
      this.container.appendChild(moneda.element);
    }
  }

  agregarEventos() {
    window.addEventListener("keydown", (e) => this.personaje.mover(e));
    window.addEventListener("keydown", (e) => this.personaje1.mover(e));
    this.checkColisiones();
  }

  checkColisiones() {
    this.colisionInterval = setInterval(() => {
      this.monedas.forEach((moneda, index) => {
        if (this.personaje.colisionaCon(moneda)) {
          this.container.removeChild(moneda.element);
          this.monedas.splice(index, 1);
          this.actualizarPuntuacion(10);
        } else if (this.personaje1.colisionaCon(moneda)) {
          this.container.removeChild(moneda.element);
          this.monedas.splice(index, 1);
          this.actualizarPuntuacion1(10);
        }
      });

      // Verifica si ya no quedan monedas
      if (this.monedas.length === 0) {
        clearInterval(this.colisionInterval);
        this.mostrarGanador();
      }
    }, 100);
  }

  mostrarGanador() {
    let mensaje = "";
    if (this.puntuacion > this.puntuacion1) {
      mensaje = "¡Jugador I gana!";
    } else if (this.puntuacion1 > this.puntuacion) {
      mensaje = "¡Jugador II gana!";
    } else {
      mensaje = "¡Empate!";
    }
    alert(mensaje);
  }

  actualizarPuntuacion(puntos) {
    this.puntuacion += puntos;
    this.puntosElement.textContent = `Puntos jugador I: ${this.puntuacion}`;
  }
  actualizarPuntuacion1(puntos) {
    this.puntuacion1 += puntos;
    this.puntos1Element.textContent = `Puntos jugador II: ${this.puntuacion1}`;
  } 
}

class Personaje {
  constructor(player) {

    this.container = document.getElementById("game-container");


    this.element = document.createElement("img");
    this.element.classList.add("personaje");

    if(player == 0){
      this.x = 50;
      this.y = 300;
      this.player = 0;
      this.element.src = "img/player.png";
    }else{
      this.x = this.container.clientWidth - 120;
      this.y = 300;
      this.player = 1;
      this.element.src = "img/player1.png";
    }

    this.width = 100;
    this.height = 100;
    this.velocidad = 10;
    this.saltando = false;



    

    this.actualizarPosicion();
  }

  mover(evento) {
    if(this.player == 0){
      const key = evento.key.toLowerCase();
      if (key === "d" && this.x + this.width < this.container.clientWidth) {
        this.x += this.velocidad;
        this.element.style.transform = "scaleX(1)"; // Voltear personaje
      } else if (key === "a" && this.x > this.container.clientLeft ) {
        this.x -= this.velocidad;
        this.element.style.transform = "scaleX(-1)"; // Voltear personaje
      } else if (key === "w" && !this.saltando) {
        this.saltar();
      }

      this.actualizarPosicion();
    }else{
      if (evento.key === "ArrowRight" && this.x + this.width < this.container.clientWidth) {
        this.x += this.velocidad;
        this.element.style.transform = "scaleX(-1)"; // Voltear personaje
      } else if (evento.key === "ArrowLeft" && this.x > this.container.clientLeft ) {
        this.element.style.transform = "scaleX(1)"; // Voltear personaje
        this.x -= this.velocidad;
      } else if (evento.key === "ArrowUp" && !this.saltando) {
        this.saltar();
      }

      this.actualizarPosicion();
    }

  }

  saltar() {
    this.saltando = true;
    let alturaMaxima = this.y - 250;

    const salto = setInterval(() => {
      if (this.y > alturaMaxima) {
        this.y -= 20;
      } else {
        clearInterval(salto);
        this.caer();
      }
      this.actualizarPosicion();
    }, 20);
  }

  caer() {
    const gravedad = setInterval(() => {
      if (this.y < 300) {
        this.y += 10;
      } else {
        clearInterval(gravedad);
        this.saltando = false;
      }
      this.actualizarPosicion();
    }, 20);
  }

  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  colisionaCon(objeto) {
    return (
      this.x < objeto.x + objeto.width &&
      this.x + this.width > objeto.x &&
      this.y < objeto.y + objeto.height &&
      this.y + this.height > objeto.y
    );
  }
}

class Moneda {
  constructor() {
    this.x = Math.random() * 700 + 50;
    this.y = Math.random() * 250 + 50;
    this.width = 40;
    this.height = 40;
    this.element = document.createElement("img");
    this.element.classList.add("moneda");
    this.element.src = "img/moneda.png"

    this.actualizarPosicion();
  }

  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}

const juego = new Game();