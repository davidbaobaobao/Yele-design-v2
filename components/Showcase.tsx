import ShowcaseClient from './ShowcaseClient'

export type ShowcaseProject = {
  id: string
  name: string
  main_image: string
  description: string | null
  additional_images: unknown
}

const PROJECTS: ShowcaseProject[] = [
  { id: '1',  name: 'Arquitectura · Barcelona',       description: null, additional_images: [], main_image: '/media/carouselmedia/Brutalist_concrete_arches_fog_2K_202607141213.jpeg' },
  { id: '2',  name: 'Diseño Editorial · Madrid',      description: null, additional_images: [], main_image: '/media/carouselmedia/Chrome_sculpture_website_page_il…_202607141657.jpeg' },
  { id: '3',  name: 'Granada Turismo · Granada',      description: null, additional_images: [], main_image: '/media/carouselmedia/Granada_landscape_with_typography_2K_202607141213.jpeg' },
  { id: '4',  name: 'Startup Tech · Valencia',        description: null, additional_images: [], main_image: '/media/carouselmedia/MacBook_between_rock_formations_2K_202607141240.jpeg' },
  { id: '5',  name: 'Estudio Creativo · Sevilla',     description: null, additional_images: [], main_image: '/media/carouselmedia/MacBook_on_pedestal_studio_202607141739.jpeg' },
  { id: '6',  name: 'Consultora Digital · Bilbao',    description: null, additional_images: [], main_image: '/media/carouselmedia/MacBook_on_rock_studio_202607141759.jpeg' },
  { id: '7',  name: 'Agencia de Viajes · Málaga',     description: null, additional_images: [], main_image: '/media/carouselmedia/MacBook_on_rocks_studio_2K_202607141323.jpeg' },
  { id: '8',  name: 'App de Eventos · Zaragoza',      description: null, additional_images: [], main_image: '/media/carouselmedia/UI_mockup_screens_event_app_202607141621.jpeg' },
  { id: '9',  name: 'Plataforma SaaS · Madrid',       description: null, additional_images: [], main_image: '/media/carouselmedia/Web_hero_mockup_rounded_card_202607141215.jpeg' },
  { id: '10', name: 'Portfolio Digital · Barcelona',  description: null, additional_images: [], main_image: '/media/carouselmedia/image.png_202607141751.jpeg' },
]

export default function Showcase({ noHeader, noBg, fullScreen }: { noHeader?: boolean; noBg?: boolean; fullScreen?: boolean } = {}) {
  return <ShowcaseClient projects={PROJECTS} noHeader={noHeader} noBg={noBg} fullScreen={fullScreen} />
}
