// /app/api/parse-product/route.ts

import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

interface ItemData {
  name: string;
  image: string;
  price: number;
  description: string;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Invalid URL provided.' }, { status: 400 });
    }

    const parsedUrl = new URL(url);
    
    if (!parsedUrl.hostname.includes('market.yandex.ru')) {
      return NextResponse.json({ error: 'Unsupported domain.' }, { status: 400 });
    }

    // Launch Puppeteer headless browser with more options to mimic human interaction
    const browser = await puppeteer.launch({
      headless: false, // Disable headless mode to mimic a real browser
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
    });
    const page = await browser.newPage();

    // Set a custom User-Agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    // Set additional headers and parameters to make the browser appear more human-like
    await page.setViewport({ width: 1280, height: 800 });
    await page.setExtraHTTPHeaders({
      'accept-language': 'en-US,en;q=0.9',
      'referer': 'https://market.yandex.ru',
    });

    // Navigate to the page
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Extract product data
    const itemData: ItemData = await page.evaluate(() => {
      // Extract product name
      const name = document.querySelector('h1')?.textContent?.trim() || '';

      // Extract product description
      const description = document.querySelector('div[aria-label="product-description"]')?.textContent?.replace(/\n/g, ' ').trim() || 'No description available.';

      // Extract product price
      let priceText = document.querySelector('h3[data-auto="snippet-price-current"]')?.textContent || '';
      priceText = priceText.replace(/[^\d]/g, ''); // Remove non-numeric characters
      const price = parseInt(priceText, 10) || 0;

      // Extract product image
      let image = document.querySelector('button[data-auto="thumbnail"] img')?.getAttribute('src') || '';
      if (image.startsWith('//')) {
        image = 'https:' + image;
      }

      return { name, image, price, description };
    });

    console.log('Parsed Data:', itemData);

    await browser.close();

    if (!itemData.name || !itemData.price || !itemData.image) {
      return NextResponse.json({ error: 'Unable to extract product data.' }, { status: 500 });
    }

    return NextResponse.json(itemData, { status: 200 });
  } catch (error) {
    console.error('Error parsing product URL:', error);
    return NextResponse.json({ error: 'Failed to parse the product URL.' }, { status: 500 });
  }
}
