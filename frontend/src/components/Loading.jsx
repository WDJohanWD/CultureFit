import React from 'react';
import { Dumbbell, Zap, Heart } from 'lucide-react';


const GymSpinnerLoader = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] space-y-8 p-6">
      {/* Contenedor principal del spinner */}
      <div className="relative">
        {/* Anillo exterior con gradiente */}
        <div className="w-28 h-28 rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-primary border-r-secondary animate-spin" style={{ animationDuration: '2s' }}></div>
        </div>
        
        {/* Anillo intermedio */}
        <div className="absolute inset-3 rounded-full border-3 border-dashed border-accent/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '4s' }}></div>
        
        {/* Centro con icono de pesa */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <Dumbbell 
              size={32} 
              className="text-primary animate-pulse drop-shadow-lg" 
              style={{ animationDuration: '1.5s' }}
            />
            {/* Efecto de brillo en el icono */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
        
        {/* Iconos orbitales */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s' }}>
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <Zap size={16} className="text-secondary drop-shadow" />
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <Heart size={16} className="text-destructive drop-shadow" />
          </div>
        </div>
        
        {/* Partículas flotantes */}
        <div className="absolute inset-0">
          <div className="absolute top-2 left-2 w-1 h-1 bg-primary rounded-full animate-ping"></div>
          <div className="absolute bottom-3 right-3 w-1 h-1 bg-secondary rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-4 right-2 w-1 h-1 bg-accent rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
      
      {/* Sección de mensaje mejorada */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-foreground">
          💪 {message}
        </h3>
        
        {/* Barra de progreso con gradiente */}
        <div className="w-56 h-3 bg-muted rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-pulse shadow-sm"></div>
        </div>
        
        {/* Texto motivacional */}
        <p className="text-muted-foreground font-medium">
          ¡Mantente fuerte mientras preparamos todo!
        </p>
        
        {/* Indicadores de carga mejorados */}
        <div className="flex space-x-3 justify-center">
          <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-gradient-to-r from-secondary to-accent rounded-full animate-bounce shadow-lg" style={{ animationDelay: '300ms' }}></div>
          <div className="w-3 h-3 bg-gradient-to-r from-accent to-primary rounded-full animate-bounce shadow-lg" style={{ animationDelay: '600ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default GymSpinnerLoader;
