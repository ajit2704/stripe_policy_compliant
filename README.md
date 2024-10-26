## Steps to run

1. Do a ```npm install```
2. Replace your open AI key in ```.env``` file
3. do a npm start
4. Use this curl to hit the API: ```curl --request POST \
  --url http://localhost:3000/check_compliance \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/10.0.0' \
  --data '{
  "webpage_url": "https://mercury.com",
  "compliance_policy": "https://stripe.com/docs/treasury/marketing-treasury"
}' ```

## How did I arrived at this solution

1. Since, the emphasis on typescript, I chose to code in it. Never had to write with ```express``` before, but it was lot easier.
2. Initially express was throwing error for with express as I was using Request and Response object. Realized that I have to handle errors for unresolved promises. So, found on stackoverflow a neat function to avoid any further issue:
    ```
    const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
    ```
3. I was using old and depreacated openai functions needed to update that.
4. To compare and get the content of both the url's for complicance check. I used cheerio to scrapte pages and pass it to our model assuming both of them were static websites.
5. When all was set and the server was up, I hit the api and it was throwing error for maximum token size. Since I didn't do any preprocessing on the html content I loaded, it extracted lot of unnecessary data.
6. To tackle that, I created method to extract all innerText of html . I removed all html tag which not visible and then extracted all the text under the body tag.
7. Another challenge was, stripe page is not static and loads dynamically. To handle that I found ```puppeteer``` library. It loads the page in headless browser and that's how I extracted the data for policy which was under ```Doc``` class on that page.
8. Finally when my request was hitting the openai api, I needed to do some tweaking as per openai chat api docs. Initially I realized that models like ```3.5-turbo``` throws very inconsistent reponse. In one it was compliant in another it was not.
9. So, altogether decided to use ```4-0```, which was more insightful. 

