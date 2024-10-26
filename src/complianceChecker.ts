import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';


// Function to fetch and scrape compliance policy content
export const fetchCompliancePolicyContent = async (policyUrl: string): Promise<string> => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      
      await page.goto(policyUrl, { waitUntil: 'networkidle2' });
      
      // Get the content from the targeted div
      const policyContent = await page.$eval('div.Document[data-testid="docs-content"]', el => el.innerText);
      
      await browser.close();
  
      if (!policyContent) {
        throw new Error('Content not found for the specified selector.');
      }
  
      return policyContent;
    } catch (error : any) {
      console.error(`Failed to fetch or parse compliance policy content: ${error.message}`);
      throw error;
    }
  };