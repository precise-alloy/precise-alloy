import { AutoCompleteModel, ButtonModel, FacetItemModel, IconModel, PictureModel, SpinnerModel, WistiaVideoModel } from './atoms';
import {
  ButtonExpanderModel,
  CartItemModel,
  DropdownModel,
  FilterItemModel,
  LinkCartModel,
  LinkListModel,
  LinkWithIconListModel,
  PaginationModel,
  RichTextModel,
  SearchResultItemModel,
  SectionHeaderModel,
  SortDropdownModel,
  TableModel,
  OrderLineModel,
  LinkCardModel,
  AccordionItemModel,
  TabSwitcherModel,
  FacetGroupModel,
  PrimaryNavModel,
  ExpanderWrapperModel,
} from './molecules';
import { BasedAtomicModel } from './_general';
import { LinkModel } from '@_types/types';
import Icon from './../atoms/icons/Icon';
import { Icon } from '@atoms/icons/Icon';

export interface ContactBannerModel extends BasedAtomicModel {
  img?: PictureModel;
  header?: SectionHeaderModel;
  helpfulLinksHeading?: string;
  links: LinkListModel;
  linkWithIcons: LinkWithIconListModel;
}

export interface MosaicCardModel extends BasedAtomicModel {
  styleModifier: (
    | 'background-image'
    | 'top-image'
    | 'bottom-image'
    | 'left-image'
    | 'right-image'
    | 'round-image'
    | 'image-auto-height'
    | 'no-image'
    | 'dot-image'
    | 'text-left'
    | 'text-center'
    | 'text-right'
    | 'text-top'
    | 'text-middle'
    | 'text-bottom'
    | 'text-xxs'
    | 'text-xs'
    | 'text-sm'
    | 'text-lg'
    | 'text-xl'
    | 'button-left'
    | 'button-center'
    | 'button-right'
    | 'box-shadow'
  )[];
  img?: PictureModel;
  video?: WistiaVideoModel;
  subHeading?: string;
  heading?: string;
  size?: 'lg' | 'xl';
  text?: string;
  buttons?: ButtonModel[];
  span?: number;
  recommendedText?: string;
}

export interface MosaicCardListModel extends BasedAtomicModel {
  styleModifier?: ('container-width' | 'tablet-full-width' | 'no-gap')[];
  header?: RichTextModel;
  items: MosaicCardModel[];
  loadMoreUrl?: string;
  buttons?: ButtonModel[];
  plusButton?: {
    label: string;
  };
}

export interface HeaderSecondaryItemModel extends BasedAtomicModel {
  text?: string;
  id?: number;
  url?: string;
  isNormalItem?: boolean;
  isFavouritesItem?: boolean;
  isSelectCustomerItem?: boolean;
  isSelectRegion?: boolean;
  isSupport?: boolean;
  icon?: IconModel;
}

export interface HeaderModel extends BasedAtomicModel {
  styleModifier?: 'menu-right'[];
  headerSecondary?: HeaderSecondaryModel;
  backgroundImage?: PictureModel;
  headerMenu?: HeaderMenuListModel;
  previousText?: string;
  previousIcon?: IconModel;
  searchBar?: SearchBarModel;
  userProfileBanner?: UserProfileBannerModel;
  crossPortalMenu?: CrossPortalMenuModel;
  hamburger?: HamburgerModel;
}

export interface BreadCrumbModel extends BasedAtomicModel {
  text?: string;
  url?: string;
  id?: number;
}

export interface BreadCrumbListModel extends BasedAtomicModel {
  hamburger?: HamburgerModel;
  breadCrumb: {
    items?: BreadCrumbModel[];
    styleModifier?: string[];
  };
}

export interface CustomerDropdown extends DropdownModel {
  apiUrl?: string;
}

export interface UserProfileBannerModel extends BasedAtomicModel {
  styleModifier?: ('customer-show' | 'local-show')[];
  dataCustomer?: CustomerDropdown;
  dataLocal?: DropdownModel;
  supportUrl?: string;
}

export interface HeaderMenuItemModel extends BasedAtomicModel {
  text?: string;
  url?: string;
  children?: HeaderMenuItemModel[];
  menuId?: string;
}

export interface HeaderMenuListModel extends BasedAtomicModel {
  items?: HeaderMenuItemModel[];
  title?: string;
  styleModifier?: ('no-height' | 'ignore-first-level')[];
}

export interface BlogGridModel extends BasedAtomicModel {
  filterProps: {
    id: string;
    options: { value: string; label: string; default?: boolean }[];
  };
  gridProps: {
    initialItems: BlogGridItemModel[];
    loadMoreBtn: {
      initialShow: boolean;
      label: string;
    };
    endpoints: {
      getBlogsByCategory: string;
    };
    noResultText: string;
  };
  lang: string;
}

export interface BlogGridItemModel extends BasedAtomicModel {
  img?: PictureModel;
  category?: string;
  time?: string;
  title?: string;
  description?: string;
  url: string;
}

export interface BusinessPartnerPopupModel extends BasedAtomicModel {
  title?: string;
  subtitle?: string;
  choices?: RadioModel[];
  button?: ButtonModel;
  actionUrl?: string;
  errorText: string;
}

export interface SearchBarModel extends BasedAtomicModel {
  autoComplete?: AutoCompleteModel;
  linkCart?: LinkCartModel;
  logo?: IconModel;
  searchButton?: IconModel;
  styleModifier?: ('hide-desktop' | 'large' | 'no-padding' | 'padding-large')[];
  menu?: LinkListModel;
}
export interface CrossPortalMenuModel extends BasedAtomicModel {
  links: LinkListModel;
  languageIcon: LinkWithIconModel;
  avatarIcon: LinkWithIconModel;
  logoutIcon?: LinkWithIconModel;
  acountLinks?: LinkListModel;
  styleModifier?: ('no-border' | 'margin-top' | 'into-container')[];
}

export interface AccessAreaItemModel extends BasedAtomicModel {
  title?: string;
  childTitle?: string;
  items: LinkCardModel[];
}

export interface AccessAreaModel extends BasedAtomicModel {
  areas: AccessAreaItemModel[];
}

export interface ProductCardV4Model extends BasedAtomicModel {
  isNew: boolean;
  timestamp: string;
  badge: string;
  url: string;
  pictureProperties: PictureModel;
  category: string;
  categoryLv1Id: string[];
  categoryLv2Id: { [key: string]: string[] };
  heading: string;
  description: string;
  markedAsFavorite: boolean;
  productId?: string;
  apiEndpoints?: {
    markAsFavorite: string;
  };
}

export interface ProductListV4Model extends BasedAtomicModel {
  expander: ButtonExpanderModel;
  listId: string;
  items: ProductCardV4Model[];
}

export interface ProductListFilterModel extends BasedAtomicModel {
  filterId: string;
  options: FilterItemModel[];
}

export interface Lv2ProductListFilterModel {
  [key: string]: FilterItemModel[];
}

export interface ProductMainAreaModel extends BasedAtomicModel {
  leftNavigation?: {
    header?: {
      heading?: string;
      text?: string;
      styleModifier?: string[];
    };
    sectionLinksHeader?: IconModel;
    sections?: LinkModel[];
    helpLinks?: LinkWithIconListModel;
  };
  carousel?: CarouselModel;
  richTexts?: {
    id?: string;
    text?: string;
    richText?: RichTextModel;
  }[];
  code?: string;
  price?: string;
  taxText?: string;
  quantity?: number;
  productId: string;
  isVariation?: boolean;
  addButtonText?: string;
  addedButtonText?: string;
  isInBasket?: boolean;
  needGetPrice?: boolean;
  articleNumber?: string;
  productExplorer?: ProductExplorerModel;
}

export interface CarouselItemModel extends BasedAtomicModel {
  autoplayTimeout?: number;
  image?: PictureModel;
  video?: WistiaVideoModel;
  heroBanner?: HeroBannerRegularModel;
}

export interface CarouselModel extends BasedAtomicModel {
  hasNavigation?: boolean;
  hasPagination?: boolean;
  items?: CarouselItemModel[];
  links?: LinkWithIconListModel;
}

export interface SearchResultListModel extends BasedAtomicModel {
  styleModifier?: ('favorite-list' | 'search-list' | 'cart-list' | '5cols' | '6cols')[];
  articles: SearchResultItemModel[];
  heading?: string;
  numberOfPages?: number;
  numberOfHits?: number;
  currentIndex?: number;
  hasMore?: boolean;
  subHeader?: string;
  tableName?: string;
  quantityText?: string;
  searchText?: string;
  isGridView?: boolean;
  filterData?: ProductListFilterModel;
  addBtnText?: string;
  addedBtnText?: string;
  noResultText?: string;
  oneResultText?: string;
  multipleResultText?: string;
  paginationData?: PaginationModel;
  itemText?: string;
  totalText?: string;
  gotPrice?: boolean;
}

export interface CartListModel extends SearchResultListModel {
  articles: CartItemModel[];
  totalPriceText: string;
  totalPriceDescription?: string;
  continueButton: string;
  checkoutButton: string;
  checkoutUrl?: string;
  continueUrl?: string;
}

export interface SearchListModel extends SearchResultListModel {
  facetGroups: {
    name: string;
    key: 'typeFilter';
    facets: FacetModel[];
  }[];
}

export interface FacetModel extends BasedAtomicModel {
  key: string;
  name: string;
  count?: number;
  selected?: boolean;
  subfacets?: any;
}

export interface ProductCardModel extends BasedAtomicModel {
  styleModifier?: ('new' | 'categoried')[];
  url?: string;
  img?: PictureModel;
  badge?: string;
  category?: string;
  heading: string;
  description?: string;
  productId?: string;
  canFav?: boolean;
  lv1Categories?: string[];
  lv2Categories?: string[];
  timestamp: string;
  markedAsFavorite?: boolean;
}

export interface ProductCardListModel extends BasedAtomicModel {
  styleModifier?: ('5cols' | '6cols')[];
  allText: string;
  lv1Categories?: FilterItemModel[];
  lv2Categories?: FilterItemModel[];
  sorts?: SortDropdownModel;
  items: ProductCardModel[];
  expander?: ButtonExpanderModel;
  heading?: string;
  description?: string;
  rowDesktopCount?: number;
  rowMobileCount?: number;
}

export interface TabContainerModel extends BasedAtomicModel {
  isFullWidth?: boolean;
  header?: SectionHeaderModel;
  tabSwitcher?: TabSwitcherModel;
  downloadBlockProperties?: DownloadBlockModel;
  expander?: ButtonExpanderModel;
  productMediaGrid?: GridModel;
}

export interface DownloadBlockModel extends BasedAtomicModel {
  label?: string;
  filter?: FilterModel;
  downloadItems?: DownloadListModel[];
}

export interface DownloadListModel extends BasedAtomicModel {
  tabName?: string;
  expander?: ButtonExpanderModel;
  items?: DownloadItemModel[];
}

export interface ProductExplorerModel extends BasedAtomicModel {
  tabContainer?: TabContainerModel;
}

export interface HeaderSecondaryModel extends BasedAtomicModel {
  items: HeaderSecondaryItemModel[];
}

export interface CheckoutModel extends BasedAtomicModel {
  header?: SectionHeaderModel;
  billingTitle?: string;
  billingDescription?: string;
  billingAddress?: AddressModel;
  purchaseOrderInputTitle?: string;
  purchaseOrderInputPlaceholder?: string;
  purchaseOrderErrorText?: string;
  shippingTitle?: string;
  shippingDescription?: string;
  shippingAddress?: AddressModel;
  paymentTitle?: string;
  paymentDescription?: string;
  contactTitle?: string;
  contactName?: string;
  contactNameInputTitle?: string;
  contactNameErrorText?: string;
  contactNameInputPlaceholder?: string;
  contactPhoneInputTitle?: string;
  contactPhoneInputPlaceholder?: string;
  contactPhoneErrorText?: string;
  term?: string;
  confirmButton?: Button;
  checkoutSummary?: CheckoutSummaryModel;
}

export interface AccordionListModel extends BasedAtomicModel {
  accordionsList: AccordionItemModel[];
  expandFirst?: boolean;
}

export interface CheckoutSummaryModel extends EShopCheckoutSummaryTotalModel {
  table?: CheckoutSummaryTableModel;
}

export interface CheckoutSummaryTableModel extends TableModel {
  orderLines?: OrderLineModel[];
}

export interface OrderHistoryItemModel extends BasedAtomicModel {
  orderDate?: string;
  orderNumber?: string;
  referenceNumber?: string | null;
  customerPoNumber?: string;
  billing?: string;
  delivery?: string;
  numberOfItems?: number;
  total?: string;
  statusCode?: string;
  statusText?: string;
}

export interface dataSourceOrderHistoryModel extends BasedAtomicModel {
  dateHeader?: string;
  orderIdHeader?: string;
  customerPoHeader?: string;
  billingHeader?: string;
  deliveryHeader?: string;
  totalInHeader?: string;
  statusHeader?: string;
}

export interface OrderHistoryModel extends dataSourceOrderHistoryModel {
  items?: OrderHistoryItemModel[];
  orderDetailPageUrl?: string;
  header?: string;
  noDataText?: string;
  filterPlaceholder?: string;
  notFoundText?: string;
}

export interface OrderDetailModel extends BasedAtomicModel {
  heading?: string;
  informationHeading?: string;
  orderIdHeading?: string;
  orderNumber?: string;
  purchaseOrderHeading?: string;
  customerPoNumber?: string;
  customerIdHeading?: string;
  soldToId?: string;
  dateHeading?: string;
  orderDate?: string;
  statusHeading?: string;
  processingStatusCode?: string;
  processingStatusCodeText?: string;
  billingHeading?: string;
  billing?: string;
  billingText?: string;
  deliveryHeading?: string;
  deliveryText?: string;
  delivery?: string;
  paymentHeading?: string;
  termsOfPayment?: string;
  articles?: EShopOrderDetailTableItemModel[];
  currentCurrency?: string;
  priceTotal?: string;
  transportTotal?: string;
  taxTotal?: string;
  totalAmount?: string;
  multipleResultText?: string;
  oneResultText?: string;
  noResultText?: string;
  subTotalHeading?: string;
  freightAndHandlingHeading?: string;
  taxTotalHeading?: string;
  totalHeading?: string;
  contractHeading?: string;
  quantityHeading?: string;
  totalInHeading?: string;
  estShippingDateHeading?: string;
  addText?: string;
  addedText?: string;
  addToCartText?: string;
  allAddedText?: string;
  printText?: string;
  itemsHeading?: string;
}

export interface OrderDetailGridModel extends BasedAtomicModel {
  items?: OrderDetailGridItemModel[];
}

export interface OrderDetailGridItemModel extends BasedAtomicModel {
  heading?: string;
}

export interface EShopCheckoutSummaryTotalModel extends BasedAtomicModel {
  title?: string;
  subTotalText?: string;
  transportText?: string;
  taxTotalText?: string;
  totalText?: string;
  countText?: string;
  gotPrice?: boolean;
  totalQty?: number;
  currencySymbol?: string;
  subTotal?: string;
  transport?: string;
  taxTotal?: string;
  total?: string;
  isRawData?: boolean;
}

export interface OrderDetailItemModel extends BasedAtomicModel {
  id?: string;
  isProduct?: boolean;
  isInBasket?: boolean;
  name?: string;
  materialId?: string;
  code?: string;
  quantity?: number;
  price?: number;
  totalPrice?: number;
  amount?: number;
  link?: string;
  image?: string;
  isAvailableToBuy?: boolean;
  deliveryStatusCode?: string;
  deliveryStatusCodeText?: string;
  expectedDeliveryDate?: string;
  contract?: string;
}

export interface OrderConfirmationModel extends BasedAtomicModel {
  orderNumber?: string;
  title?: string;
  icon?: IconModel;
  richText?: RichTextModel;
  checkoutSummary?: CheckoutSummaryModel;
  printText?: string;
  closeText?: string;
  closeUrl?: string;
}

export interface CategoryListModel extends BasedAtomicModel {
  header?: string;
  expander?: ButtonExpanderModel;
  categories?: CategoryItemModel[];
  styleModifier?: ('space-sm' | 'multi-column' | '6cols')[];
}

export interface SpaceRequirementModel extends BasedAtomicModel { }

export type SituationDownload = {
  name: string;
  format: string;
  size: string;
  url: string;
};
export interface SituationModel extends BasedAtomicModel {
  id: string;
  spaceId: string;
  name: string;
  url: string;
  src: string;
  category?: string;
  group?: string;
  information?: string;
  considerThis?: string;
  adviceAndTips?: string;
  mobilityGallery: string[];
  relatedProducts?: ProductDownloadItemModel[];
  downloads?: SituationDownload[];
  images?: string[];
}

export interface SpaceRequirementDetailModel extends BasedAtomicModel {
  id: string;
  name: string;
  url: string;
  description?: string;
  preDrawingsText?: string;
  drawingsText?: string;
  descriptionTitle?: string;
  productsTitle?: string;
  downloadsTitle?: string;
  informationTitle?: string;
  considerThisTitle?: string;
  adviceAndTipsTitle?: string;
  backToSelectionText?: string;
  backToSelectionUrl?: string;
  mobilityGalleryUrl?: string;
  situation?: SituationModel;
  situations: {
    id: string;
    name: string;
    url?: string;
    src: string;
  }[];
  siblings: {
    id: string;
    name: string;
    url: string;
  }[];
  expanderWrapper?: ExpanderWrapperModel;
  language?: string;
}

export interface ProductDownloadItemModel extends BasedAtomicModel {
  id: string;
  name: string;
  url: string;
  src: string;
  types?: string[];
  categories?: string[];
  groups?: string[];
  formats?: string[];
  spaces?: string[];
  mobilityGallery?: string[];
}

export interface ArchitectResultsModel extends BasedAtomicModel {
  results: ProductDownloadItemModel[];
  types?: FacetGroupModel;
  showingNResults?: string;
}

export interface ArchitectSearchModel extends BasedAtomicModel {
  value?: string;
  placeholder?: string;
}

export interface ArchitectDownloadModel extends BasedAtomicModel {
  spaceRequirementMode?: boolean;
  items: ProductDownloadItemModel[];
  types?: FacetGroupModel;
  categories?: FacetGroupModel;
  groups?: FacetGroupModel;
  formats?: FacetGroupModel;
  spaces?: FacetGroupModel;
  mobilityGallery?: FacetGroupModel;
  searchPlaceholder?: string;
  showingNResults?: string;
}

export interface LinkReferencesModel extends BasedAtomicModel {
  styleModifier?: ('opened' | 'no-toggle' | 'keep-container' | 'col-left')[];
  head?: string;
  links?: {
    id?: string;
    text?: string;
  }[];
}

export interface HeaderModel extends BasedAtomicModel {
  bgImage?: {
    src?: string;
  };
  headerTooltip?: {
    mobile?: {
      outer?: RegionChangeTooltipModel;
      inner?: {
        upper?: RegionChangeTooltipModel;
        lower?: RegionChangeTooltipModel;
      };
    };
    desktop?: RegionChangeTooltipModel;
  };
  url?: string;
  searchIcon?: IconModel;
  primaryNavItems?: PrimaryNavModel;
  topNav?: {
    links?: LinkModel[];
    text?: string;
    location?: string;
    icon?: IconModel;
  };
  earthIcon?: IconModel;
  searchBox?: {
    mobileAutocomplete?: AutoCompleteModel;
    desktopAutocomplete?: AutoCompleteModel;
  };
  searchIconWithBackground?: IconWithBgModel;
  closeIconWithBackground?: IconWithBgModel;
  crossPortalMenu?: CrossPortalMenuModel;
}

export interface RegionChangeTooltipModel extends BasedAtomicModel {
  icon?: IconModel;
  text?: string;
  okButton?: ButtonModel;
  className?: string;
}

export interface DocumentTocModel extends BasedAtomicModel {
  styleModifiers?: 'bg-white'[];
  heading?: string;
  preamble?: string;
  rickText?: RichTextModel;
  linkWithIconList?: LinkWithIconListModel;
}

export interface SubscriptionPopupModel extends BasedAtomicModel {
  className?: string;
  popupId?: string;
  subscriptionUrl?: string;
  result?: {
    success?: boolean;
    alreadySubscribed?: boolean;
    failed?: boolean;
  };
  spinner?: SpinnerModel;
  closeButton?: IconModel;
  okButton?: ButtonModel;
  heading?: string;
  areaOfInterest?: {
    heading?: string;
    productNews?: {
      label?: string;
    };
    pressReleaseAndRegulatoryNews: {
      label?: string;
    };
    news?: {
      label?: string;
    };
    errors?: string;
  };
  emailInput?: {
    label?: string;
    errors?: string;
  };
  acceptPolicy?: {
    label?: string;
  };
  submit?: ButtonModel;
  content?: string;
}

export interface SpaceRequirementDownloadListModel extends BasedAtomicModel {
  downloadsList: SituationDownload[];
}
export interface EShopFooterModel extends BasedAtomicModel {
  logo: {
    url?: string;
    title?: string;
  };
  motto: {
    text?: string;
    heading: string;
    icon: string;
  }
  navLinks: LinkListModel[];
  contactSocialMediaHeading?: string;
  contactPhoneAddress?: string;
  socialMediaLinks: {
    url: string,
    title?: string,
    alt?: string,
    iconPath: string,
  }[];

  policyLinks: LinkListModel;
  allRightsText?: string;
}
