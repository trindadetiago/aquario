import React from 'react';
import { Badge } from '../ui/badge';

interface BadgeProps {
  type: "laboratorio" | "pessoa" | "oficial" | "grupo" | "externo";
  size: "large" | "small";
}

const TypeBadge: React.FC<BadgeProps> = ({ type, size }) => {


  const corrsBig = {
    laboratorio: "Laboratório",
    pessoa : "Pessoa",
    oficial: "Oficial",
    grupo: "Grupo",
    externo: "Externo"

  };
  const corrsSmall = {
    laboratorio: "LAB",
    pessoa : "PES",
    oficial: "ADM",
    grupo: "GRP",
    externo: "EXT"

  };
  
  const colorsBig = {
    laboratorio: 'text-violet-700 bg-violet-200 px-2 py-0.5 border-violet-700 hover:bg-violet-200',
    pessoa: 'text-red-700 bg-red-200 border-red-700 px-3 py-0.5 hover:bg-red-200',
    oficial: 'text-fuchsia-700 bg-fuchsia-200 border-fuchsia-700 px-3 py-0.5 hover:bg-fuchsia-200',
    grupo: 'text-emerald-700 bg-emerald-200 border-emerald-700 px-3 py-0.5 hover:bg-emerald-200',
    externo: 'text-amber-700 bg-amber-200 border-amber-700 px-3 py-0.5 hover:bg-amber-200',
  };


  const colorsSmall = {
    laboratorio: 'text-violet-200 bg-violet-700 hover:bg-purple-200 hover:text-violet-700',
    pessoa: 'text-red-200 bg-red-700 hover:bg-red-200 hover:text-red-700',
    oficial: 'text-fuchsia-200 bg-fuchsia-700 hover:bg-fuchsia-200 hover:text-fuchsia-700',
    grupo: 'text-emerald-200 bg-emerald-700 hover:bg-emerald-200 hover:text-emerald-700',
    externo: 'text-amber-200 bg-amber-700 hover:bg-amber-200 hover:text-amber-700',
  };

  if (size === "large") {
    return (
        <Badge className={`${colorsBig[type]} font-inter rounded-full border text-[9px]`}>
            {corrsBig[type]}
        </Badge>
    )
  }else {
    return (
        <Badge className={`${colorsSmall[type]} font-inter h-4 px-2 rounded-sm text-[8px]`}>
          {corrsSmall[type]}
        </Badge>
      );
  }

};

export default TypeBadge;