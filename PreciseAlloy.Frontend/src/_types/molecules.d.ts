import { AutoCompleteModel, FacetItemModel, IconModel, LinkModel, LogoModel } from './atoms';
import { BasedAtomicModel } from './_general';

export interface ButtonExpanderModel extends BasedAtomicModel {
  showSeperator?: boolean;
  text?: string;
  btnId?: string;
  label?: string;
  collapseText?: string;
  expandText?: string;
  threshold?: number;
  thresholdMobile?: number;
  heightMode?: boolean;
}

export interface LinkListModel extends BasedAtomicModel {
  styleModifier?: ('vertical' | 'menu' | 'footer' | 'footer-policy')[];
  links: LinkModel[];
}

export interface LinkWithIconModel extends BasedAtomicModel {
  styleModifier?: ('reverse' | 'with-favorite' | 'rock-s' | 'hide-icon')[];
  url: string;
  icon: IconModel;
  text?: string;
  textAlternative?: string;
  favorite?: {
    productID?: number;
    markedAsFavorite?: boolean;
  };
  tabId?: string;
  dataParams?: string;
  active?: boolean;
}

export interface LinkWithIconListModel extends BasedAtomicModel {
  title?: string;
  subtitle?: string;
  links: LinkWithIconModel[];
}

export interface SectionHeaderModel extends BasedAtomicModel {
  styleModifier?: ('light' | 'text-left' | 'text-right' | 'space-sm')[];
  headingLevel?: 'h1' | 'h2';
  heading: string;
  text?: string;
}

export interface RichTextModel extends BasedAtomicModel {
  styleModifier?: (
    | 'drop-cap'
    | 'table-no-border'
    | 'text-center'
    | 'section-left'
    | '2-col'
    | 'fluid'
    | '2-col-sm'
    | 'overlap-footer'
    | 'padding-sm'
    | 'padding'
    | 'bg-white'
    | 'max-width'
  )[];
  expander?: ButtonExpanderModel;
  header?: string;
  content?: string;
  secondaryContent?: string | IframeWithCountryModel;
}

export interface DropdownModel extends BasedAtomicModel {
  styleModifier?: 'download-item'[];
  dropdownId: string;
  name: string;
  options: { value?: string; label: string; checked?: boolean; hidden?: boolean; turnOffAutocomplete?: boolean; otherInfo?: string }[];
  disableFirstChange?: boolean;
}

export interface HeroBannerRegularModel extends BasedAtomicModel {
  overlayAlpha?: number;
  background?: PictureModel;
  subHeading?: string;
  bigTitle?: string;
  title?: string;
  subtitle?: string;
  button?: LinkModel;
  buttons?: LinkModel[];
  //buttonIcon
  //autocomplete
}

export interface LinkCartModel extends BasedAtomicModel {
  url: string;
  text: string;
  styleModifier?: 'btn'[];
}

export interface LinkCardModel extends BasedAtomicModel {
  picture?: PictureModel;
  leftIcon?: IconModel;
  rightIcon?: IconWithBgModel;
  heading?: string;
  text?: string;
  url?: string;
  badge?: string;
  textAccess?: string;
  textAvailable?: string;
  dateAvailable?: string;
  ajaxUrl?: string;
  textAccessPending?: string;
  redirectUrl?: string;
}

export interface SearchResultItemModel extends BasedAtomicModel {
  title: string;
  excerpt?: string;
  url?: string;
  imageUrl: string;
  isProduct?: boolean;
  isFavorite?: boolean;
  isCategory?: boolean;
  quantity?: number;
  isGridView?: boolean;
  productId: string;
  isAvailableToBuy?: boolean;
  isInBasket?: boolean;
  filterTypeId?: string[];
  isVariation?: boolean;
  canFav?: boolean;
  code?: string;
  unitPrice?: number | string;
  totalPrice?: number | string;
  category?: string;
  badge?: string;
  gotPrice?: boolean;
}

export interface CartItemModel extends SearchResultItemModel { }

export interface SortDropdownModel extends BasedAtomicModel {
  dropdownId: string;
  label: string;
  options: { value: string; label: string; isDefault?: true }[];
}

export interface AddRemoveFavoriteResponseModel extends BasedAtomicModel {
  favoriteTotal: string;
}

export interface FilterItemModel extends BasedAtomicModel {
  value: string;
  label: string;
  isDefault?: boolean;
  amount?: number;
  filterUrl?: string;
}

export interface TabItemModel extends BasedAtomicModel {
  label?: string;
  id?: string;
  name?: string;
  checked?: boolean;
  src?: string;
  category?: string;
}

export interface TabSwitcherModel extends BasedAtomicModel {
  sectionLinksHeader?: IconModel;
  tabs?: TabItemModel[];
}

export interface FilterModel extends BasedAtomicModel {
  filterId?: number;
  filterLabel?: string;
  tabs?: TabItemModel[];
}

export interface DownloadItemModel extends BasedAtomicModel {
  toggle?: boolean;
  src?: string;
  heading?: string;
  text?: string;
  languageSelector?: DropdownModel;
  downloadButton?: LinkModel;
}

export interface GridModel extends BasedAtomicModel {
  items?: ProductMediaCardModel[];
  isProductMedia?: boolean;
}

export interface ProductMediaCardModel extends BasedAtomicModel {
  video?: WistiaVideoModel;
  title?: string;
  description?: string;
  isToggle?: boolean;
}

export interface EShopProductAddToCartModel extends BasedAtomicModel {
  addToCartData?: AddToCartButtonModel;
}
export interface AddToCartButtonModel extends BasedAtomicModel {
  quantity?: number;
  isInBasket?: boolean;
  addedButtonText?: string;
  addButtonText?: string;
  productId?: string;
  code?: string;
  taxText?: string;
  needGetPrice?: boolean;
  articleNumber?: string;
}

export interface AddToCartResponseModel extends BasedAtomicModel {
  errorMessage?: string;
  numberOfHits?: number;
}

export interface PaginationModel extends BasedAtomicModel {
  previousPage?: {
    show?: boolean;
    url?: string;
  };

  nextPage?: {
    show?: boolean;
    url?: string;
  };

  pages: PaginationItemModel[];
}

export interface PaginationItemModel extends BasedAtomicModel {
  isCurrentPage?: boolean;
  label: string;
  url?: string;
}

export interface AddressItemModel extends BasedAtomicModel {
  addressName: string;
  addressID: string;
  addressStreet?: string;
  addressPostalCode?: string;
  addressCity?: string;
  addressCountry?: string;
  selected?: boolean;
}

export interface AddressModel extends BasedAtomicModel {
  items?: AddressItemModel[];
  placeholder?: string;
  errorText?: string;
  ID?: string;
  showError?: boolean;
}
export interface AccordionItemModel extends BasedAtomicModel {
  header: string;
  description?: string;
  textExpandedHtml?: string;
}

export interface GetProductPriceResponseModel extends BasedAtomicModel {
  orderLines?: OrderLineModel[];
  netPriceTotal?: number;
  packagingTotal?: number;
  transportTotal?: number;
  taxTotal?: number;
  netValueTotal?: number;
  grandTotal?: number;
  currentCurrencySymbol?: string;
  error?: string;
}

export interface TableColumnModel extends BasedAtomicModel {
  key?: string;
  dataIndex: string;
  title: string;
  ceilClass?: string;
}

export interface TableModel extends BasedAtomicModel {
  dataSource: unknown[];
  columns: TableColumnModel[];
  itemPerPage?: number;
  notFoundText?: string;
  usePager?: boolean;
}

export interface OrderLineModel extends BasedAtomicModel {
  unitNetPrice?: string;
  productId?: string;
  quantity?: number;
  netPrice?: string;
  contract?: string;
  expectedDeliveryDate?: string;
}

export interface CheckoutSummaryTableItemModel extends BasedAtomicModel {
  imageHeader?: string;
  productNameHeader?: string;
  contractHeader?: string;
  unitNetPriceHeader?: string;
  quantityHeader?: string;
  netPriceHeader?: string;
  deliveryDateHeader?: string;
  productId?: number;
}

export interface CountryDropdownOptionModel {
  value?: string;
  label: string;
  checked?: boolean;
  hidden?: boolean;
  turnOffAutocomplete?: boolean;
  iframe: string;
}
export interface CountryDropdownModel extends DropdownModel {
  options: CountryDropdownOptionModel[];
}

export interface IframeWithCountryModel extends BasedAtomicModel {
  heading?: string;
  preamble?: string;
  content?: string;
  countryDropdown?: CountryDropdownModel;
}

export interface TwoColumnsWrapperModel extends BasedAtomicModel {
  content?: string;
  secondaryContent?: string | IframeWithCountryModel;
}

export interface CategoryItemModel extends BasedAtomicModel {
  image?: PictureModel;
  url?: string;
  heading?: string;
  text?: string;
  toggle?: boolean;
}

export interface FacetGroupModel extends BasedAtomicModel {
  id: string;
  name: string;
  facets: FacetItemModel[];
  collapse?: boolean;
  multiChoice?: boolean;
  tooltip?: string;
  keepCounter?: boolean;
  facetsCounter?: { [key: string]: number };
  facetsFilterCounter?: { [key: string]: number };
  facetsChecked?: string[];
}

export interface NavigationLevelItemModel extends NavigationLevel0Model {
  hasChildren?: boolean;
  text?: string;
  url?: string;
  items?: NavigationLevelItemModel[];
}

export interface PrimaryNavModel extends BasedAtomicModel {
  navigationLevel0?: NavigationLevel0Model;
  logo?: LogoModel;
  level?: number;
  hasChildren?: boolean;
  icons?: {
    leftArrowIcon?: IconModel;
    closeIcon?: IconModel;
  };
  bgImage?: {
    src?: string;
  };
  level?: number;
  items?: NavigationLevelItemModel[];
  text?: string;
}

export interface NavigationLevel0Model extends PrimaryNavModel {
  hasBackBtn?: boolean;
}

export interface SearchBoxWithIconModel extends BasedAtomicModel {
  className?: string;
  icon?: IconModel;
  autocomplete?: AutoCompleteModel;
}

export interface ArchitectTooltipModel extends BasedAtomicModel {
  styleModifier?: ('top' | 'bottom' | 'right' | 'left')[];
  content?: string;
}

export interface ExpanderWrapperModel extends BasedAtomicModel {
  styleModifier?: 'has-seperator'[];
  maxHeight?: number;
  expandText?: string;
  collapseText?: string;
}
