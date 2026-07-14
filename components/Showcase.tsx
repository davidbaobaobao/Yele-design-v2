import ShowcaseClient from './ShowcaseClient'

export type ShowcaseProject = {
  id: string
  name: string
  main_image: string
  description: string | null
  additional_images: unknown
}

const PROJECTS: ShowcaseProject[] = [
  { id: '1',  name: 'Arquitectura · Barcelona',       description: null, additional_images: [], main_image: '/media/carouselmedia/carousel-01.jpeg' },
  { id: '2',  name: 'Diseño Editorial · Madrid',      description: null, additional_images: [], main_image: '/media/carouselmedia/carousel-02.jpeg' },
  { id: '3',  name: 'Granada Turismo · Granada',      description: null, additional_images: [], main_image: '/media/carouselmedia/carousel-03.jpeg' },
  { id: '4',  name: 'Startup Tech · Valencia',        description: null, additional_images: [], main_image: '/media/carouselmedia/carousel-04.jpeg' },
  { id: '5',  name: 'Estudio Creativo · Sevilla',     description: null, additional_images: [], main_image: '/media/carouselmedia/carousel-05.jpeg' },
  { id: '6',  name: 'Consultora Digital · Bilbao',    description: null, additional_images: [], main_image: '/media/carouselmedia/carousel-06.jpeg' },
  { id: '7',  name: 'Agencia de Viajes · Málaga',     description: null, additional_images: [], main_image: '/media/carouselmedia/carousel-07.jpeg' },
  { id: '8',  name: 'App de Eventos · Zaragoza',      description: null, additional_images: [], main_image: '/media/carouselmedia/carousel-08.jpeg' },
  { id: '9',  name: 'Plataforma SaaS · Madrid',       description: null, additional_images: [], main_image: '/media/carouselmedia/carousel-09.jpeg' },
  { id: '10', name: 'Portfolio Digital · Barcelona',  description: null, additional_images: [], main_image: '/media/carouselmedia/carousel-10.jpeg' },
]

export default function Showcase({ noHeader, noBg, fullScreen }: { noHeader?: boolean; noBg?: boolean; fullScreen?: boolean } = {}) {
  return <ShowcaseClient projects={PROJECTS} noHeader={noHeader} noBg={noBg} fullScreen={fullScreen} />
}
