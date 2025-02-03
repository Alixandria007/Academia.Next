export const reducer = (state:any, action:any) => {
    switch (action.type) {
      case 'subtrair': {
        console.log("Subtraimos o Contador")
        return{...state, counter: state.counter - 1};
      }
      case 'adiciona': {
        console.log("adicionamos o Contador")
        return{...state, counter: state.counter + 1};
      }
    }
  
    console.log('NENHUMA ACTION ENCONTRADA...');
    return { ...state };
  }
