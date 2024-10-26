import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';



// Function to fetch and scrape webpage content
const fetchWithAxios = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    // Remove elements that are not visible or are not part of the main content
    $('script, style, noscript, head, [style*="display:none"], [aria-hidden="true"], [hidden]').remove();
    // Select all text content from the body (or modify this selector as needed)
    let textContent = $('body').text().trim();
    textContent = textContent.replace(/\s+/g, ' ').trim();
    console.log(textContent);
    if (textContent) {
      return textContent;
    } else {
      throw new Error('No content found with Axios and Cheerio');
    }
  } catch (error: any) {
    console.error(`Axios Error: ${error.message}`);
    throw error;
  }
};

const fetchWithPuppeteer = async (url: string): Promise<string> => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Get all the text from the body of the page
    const textContent = await page.evaluate(() => {
      return document.body.innerText; 
    });

    await browser.close();

    if (!textContent) {
      throw new Error('No content found with Puppeteer');
    }
    // console.log(textContent);
    return textContent;
  } catch (error : any) {
    console.error(`Puppeteer Error: ${error.message}`);
    throw error;
  }
};

export const fetchWebpageContent = async (url: string): Promise<string> => {
    try {
      // First, try fetching with Axios and Cheerio
      return await fetchWithAxios(url);
    } catch {
      // If Axios fails or no content is found, fall back to Puppeteer
      return await fetchWithPuppeteer(url);
    }
  };