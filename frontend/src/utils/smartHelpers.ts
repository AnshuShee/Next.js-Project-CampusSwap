import { ListingCategory, ItemCondition, ListingType } from '@/types/marketplace';

export const suggestCategory = (title: string, description: string): ListingCategory => {
  const text = `${title} ${description}`.toLowerCase();

  if (/(book|textbook|manual|notes|novel|grewal|hc verma|edition|author|sem|syllabus)/i.test(text)) {
    return 'Books';
  }
  if (/(calculator|casio|arduino|raspberry|hub|mouse|keyboard|monitor|charger|headphone|earbud|screen|usb|wire)/i.test(text)) {
    return 'Electronics';
  }
  if (/(table|desk|chair|lamp|mattress|bed|shelf|cushion|stool|cupboard|rack)/i.test(text)) {
    return 'Furniture';
  }
  if (/(drafter|roller|ruler|pencil|pen|notebook|compass|sheet|geometry|stapler|marker)/i.test(text)) {
    return 'Stationery';
  }

  return 'Other';
};

export const generateDescription = (
  title: string,
  category: ListingCategory,
  condition: ItemCondition,
  listingType: ListingType
): string => {
  const cleanTitle = title.trim() || 'this item';

  return `Item: ${cleanTitle}
Category: ${category}
Condition: ${condition} (well-maintained, tested and functional)
Type: ${listingType}

• Reason for passing on: Completed semester / course syllabus.
• Highlights: Clean condition, no damage, ready for immediate hostel or campus handover.
• Pickup Location: Can meet near hostel gate or central library during college hours.

Feel free to message or place an offer via CampusSwap!`;
};
