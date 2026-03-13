'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AboutSection() {
  const features = [
    {
      icon: '🏉',
      title: 'PASIÓN',
      desc: 'Vivimos el rugby intensamente, en cada entrenamiento y cada partido.'
    },
    {
      icon: '🤝',
      title: 'COMPAÑERISMO',
      desc: 'Somos una familia. El equipo está antes que el individuo.'
    },
    {
      icon: '💪',
      title: 'ENTREGA',
      desc: 'Damos todo en la cancha. No hay vuelta atrás cuando suena el silbato.'
    },
    {
      icon: '🎯',
      title: 'MEJORA CONTINUA',
      desc: 'Buscamos ser mejores cada día, como jugadores y como personas.'
    }
  ]

  return (
    <section id="nosotros" className="py-24 bg-white relative overflow-hidden">
      {/* Elementos decorativos */}
      <motion.div 
        className="absolute top-0 right-0 w-64 h-64 bg-ruda-green/5 rounded-full -translate-y-1/2 translate-x-1/2"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-48 h-48 bg-ruda-gold/5 rounded-full translate-y-1/2 -translate-x-1/2"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header de sección */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span 
            className="text-ruda-gold font-black text-sm tracking-widest inline-block"
            whileHover={{ scale: 1.1 }}
          >
            SOBRE NOSOTROS
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-black text-ruda-black mt-2 mb-4">
            QUIÉNES <span className="text-ruda-green">SOMOS</span>
          </h2>
          <div className="w-24 h-1 bg-ruda-gold mx-auto" />
        </motion.div>

        {/* Lema destacado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-ruda-black rounded-2xl p-8 md:p-12 mb-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-ruda-green/20 to-ruda-gold/20" />
          <div className="relative z-10">
            <motion.p 
              className="text-ruda-gold font-black text-lg tracking-widest mb-4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              NUESTRO LEMA
            </motion.p>
            <h3 className="text-4xl md:text-6xl font-black text-white italic">
              "LA LUCHA ES JUGANDO"
            </h3>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg">
              No se trata solo de ganar o perder. Se trata de dejar todo en la cancha, 
              de respetar al rival, de honrar la camiseta. Jugamos con el corazón, 
              luchamos hasta el final.
            </p>
          </div>
        </motion.div>

        {/* Grid de características */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="group bg-gray-50 rounded-xl p-6 hover:bg-ruda-green transition-all duration-300 cursor-default shadow-lg hover:shadow-xl"
            >
              <motion.div 
                className="text-4xl mb-4"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-black text-ruda-black group-hover:text-white mb-2 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 group-hover:text-white/80 transition-colors">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
