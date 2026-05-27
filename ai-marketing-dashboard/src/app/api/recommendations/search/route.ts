export interface SearchResponse {
  articles: { title: string; url: string; snippet: string; source: string }[]
  source: "serper" | "fallback"
  error?: string
}

import { NextRequest, NextResponse } from "next/server"

const FALLBACK_ARTICLES: { title: string; url: string; snippet: string; source: string; keywords: string[] }[] = [
  { title: "Cách xây dựng chiến dịch Flash Sale hiệu quả", url: "https://blog.hubspot.com/marketing/flash-sale-guide", snippet: "Flash sale là chiến lược bán hàng ngắn hạn, tạo khan hiếm và thúc đẩy quyết định mua nhanh.", source: "blog.hubspot.com", keywords: ["flash sale", "hot", "khuyến mãi", "giảm giá"] },
  { title: "Chiến lược nuôi dưỡng khách hàng tiềm năng bằng Email", url: "https://vwo.com/blog/b2b-lead-nurturing/", snippet: "Email marketing tự động hóa giúp nuôi dưỡng khách hàng ấm hiệu quả gấp 3 lần so với gửi thủ công.", source: "vwo.com", keywords: ["email", "nuôi dưỡng", "lead nurturing", "warm"] },
  { title: "Tối ưu tỷ lệ chuyển đổi: 10 phương pháp đã kiểm chứng", url: "https://neilpatel.com/what-is-conversion-optimization/", snippet: "CRO là quá trình cải thiện trải nghiệm người dùng để tăng tỷ lệ khách truy cập thực hiện hành động mong muốn.", source: "neilpatel.com", keywords: ["chuyển đổi", "conversion", "cro", "tối ưu"] },
  { title: "Retargeting: Cách tiếp cận lại khách hàng đã rời bỏ", url: "https://optinmonster.com/features/cookie-retargeting/", snippet: "Retargeting giúp bạn tiếp cận lại 97% khách truy cập đã rời đi mà không mua hàng.", source: "optinmonster.com", keywords: ["retargeting", "cold", "khách rời bỏ", "remarketing"] },
  { title: "Social Media Marketing Trends 2024", url: "https://buffer.com/resources/social-media-marketing-strategy/", snippet: "Xu hướng social media 2024: video ngắn, AI content, và social commerce đang thay đổi cách brand tiếp cận khách hàng.", source: "buffer.com", keywords: ["social media", "mạng xã hội", "facebook", "instagram"] },
  { title: "Hướng dẫn tối ưu quảng cáo Google Ads", url: "https://www.wordstream.com/blog/ws/2022/02/14/how-does-google-ads-work", snippet: "Tối ưu hóa chiến dịch Google Ads với keyword research, bid strategy và quality score improvement.", source: "wordstream.com", keywords: ["google ads", "quảng cáo", "ppc", "search", "paid"] },
  { title: "Email Marketing Segmentation: Best Practices", url: "https://mailchimp.com/resources/email-segmentation/", snippet: "Phân khúc email list dựa trên hành vi và nhân khẩu học giúp tăng open rate lên 14% và click rate lên 63%.", source: "mailchimp.com", keywords: ["email", "segment", "phân khúc", "list"] },
  { title: "Chiến lược Referral Marketing cho doanh nghiệp", url: "https://www.referralcandy.com/blog/referral-programs-what-they-are-how-they-work-and-how-to-build-one-that-grows", snippet: "Khách hàng được giới thiệu có LTV cao hơn 25% và tỷ lệ giữ chân tốt hơn.", source: "referralcandy.com", keywords: ["referral", "giới thiệu", "cold", "khách hàng mới"] },
  { title: "Mobile Marketing: Tối ưu trải nghiệm di động", url: "https://www.thinkwithgoogle.com/marketing-strategies/app-and-mobile/mobile-tools-to-optimize-site-and-app/", snippet: "Hơn 60% lượt tìm kiếm đến từ di động. Tối ưu mobile experience để không bỏ lỡ khách hàng.", source: "thinkwithgoogle.com", keywords: ["mobile", "di động", "app", "responsive"] },
  { title: "A/B Testing Guide for Marketers", url: "https://vwo.com/ab-testing-guide/", snippet: "A/B testing giúp cải thiện conversion rate dựa trên dữ liệu thực tế. Hướng dẫn chạy test từ A-Z.", source: "vwo.com", keywords: ["ab testing", "test", "thử nghiệm", "conversion"] },
  { title: "Content Marketing Strategy cho khách hàng tiềm năng", url: "https://contentmarketinginstitute.com/content-marketing-strategy/how-to-develop-a-content-strategy-start-with-these-3-questions", snippet: "Content marketing thu hút khách hàng tiềm năng qua từng giai đoạn của buyer journey.", source: "contentmarketinginstitute.com", keywords: ["content", "nội dung", "blog", "bài viết"] },
  { title: "Customer Retention: Giữ chân khách hàng hiệu quả", url: "https://blog.hubspot.com/service/customer-retention-strategies", snippet: "Tăng 5% tỷ lệ giữ chân khách hàng có thể tăng lợi nhuận lên 75%.", source: "blog.hubspot.com", keywords: ["retention", "giữ chân", "cold", "khách hàng cũ"] },
  { title: "Marketing Automation Workflows cho Email", url: "https://help.activecampaign.com/hc/en-us/articles/218788687-Create-an-automation-from-scratch-in-ActiveCampaign", snippet: "Tự động hóa email marketing với trigger-based workflows giúp tiết kiệm thời gian và tăng hiệu quả gấp đôi.", source: "activecampaign.com", keywords: ["automation", "tự động hóa", "email", "workflow"] },
  { title: "Paid Ads: Tối ưu ngân sách quảng cáo", url: "https://searchengineland.com/ppc-budgeting-adjust-scale-optimize-data-452493", snippet: "Phân bổ ngân sách paid ads hiệu quả dựa trên ROAS và customer acquisition cost.", source: "searchengineland.com", keywords: ["paid", "ads", "ngân sách", "quảng cáo", "ppc"] },
  { title: "Tận dụng dữ liệu khách hàng để cá nhân hóa marketing", url: "https://segment.com/blog/customer-data-multiplies-impact-of-CX-strategy/", snippet: "Cá nhân hóa dựa trên dữ liệu first-party giúp tăng doanh thu lên 15%.", source: "segment.com", keywords: ["dữ liệu", "personalization", "cá nhân hóa", "data"] },
  { title: "Direct Marketing: Chiến lược tiếp cận trực tiếp", url: "https://blog.hubspot.com/marketing/direct-marketing", snippet: "Direct marketing vẫn là kênh có ROI cao nhất khi được nhắm đúng đối tượng.", source: "blog.hubspot.com", keywords: ["direct", "trực tiếp", "email", "sms"] },
  { title: "Website Conversion Rate Optimization Checklist", url: "https://neilpatel.com/blog/landing-page/", snippet: "Checklist 20 điểm tối ưu conversion rate: từ landing page, CTA, form đến tốc độ tải trang.", source: "neilpatel.com", keywords: ["landing page", "cro", "conversion", "website"] },
  { title: "SEO và Search Marketing cho doanh nghiệp", url: "https://moz.com/beginners-guide-to-seo/", snippet: "SEO là nền tảng của digital marketing. Hướng dẫn toàn diện từ technical SEO đến content strategy.", source: "moz.com", keywords: ["seo", "search", "google", "tìm kiếm"] },
  { title: "Facebook Ads Targeting Best Practices", url: "https://www.facebook.com/business/help/633474486707199", snippet: "Nhắm mục tiêu quảng cáo Facebook hiệu quả với custom audiences và lookalike.", source: "facebook.com", keywords: ["facebook", "ads", "social", "targeting", "paid"] },
  { title: "Customer Lifetime Value: Cách đo lường và tối ưu", url: "https://baremetrics.com/academy/lifetime-value-ltv", snippet: "LTV là chỉ số quan trọng nhất trong marketing. Cách tính LTV và chiến lược tăng giá trị vòng đời khách hàng.", source: "baremetrics.com", keywords: ["ltv", "lifetime value", "khách hàng", "doanh thu"] },
  { title: "Influencer Marketing Strategy cho Brand", url: "https://influencermarketinghub.com/influencer-marketing-strategy/", snippet: "Influencer marketing mang lại ROI gấp 5.2 lần so với quảng cáo truyền thống.", source: "influencermarketinghub.com", keywords: ["influencer", "kols", "social", "người ảnh hưởng"] },
  { title: "Landing Page Optimization: Tăng tỷ lệ chuyển đổi", url: "https://get.unbounce.com/ultimate-guide-to-lpo/", snippet: "Landing page được tối ưu có thể tăng conversion rate lên 300%.", source: "unbounce.com", keywords: ["landing page", "conversion", "tối ưu", "cro"] },
  { title: "Marketing KPIs: Các chỉ số cần theo dõi", url: "https://databox.com/the-definitive-list-of-marketing-kpis-every-team-should-track", snippet: "Theo dõi đúng KPI giúp đo lường hiệu quả chiến dịch chính xác.", source: "databox.com", keywords: ["kpi", "metrics", "chỉ số", "đo lường"] },
  { title: "Conversational Marketing: Tự động hóa chăm sóc khách hàng", url: "https://www.drift.com/blog/where-how-to-start-with-conversational-marketing/", snippet: "Chatbot giúp thu thập leads 24/7 và trả lời khách hàng ngay lập tức.", source: "drift.com", keywords: ["chatbot", "conversational", "automation", "warm"] },
]

function getFallbackArticles(query: string, count = 6): { title: string; url: string; snippet: string; source: string }[] {
  const q = query.toLowerCase()
  const qWords = q.split(/\s+/).filter(Boolean)
  const scored = FALLBACK_ARTICLES.map((a) => {
    const title = a.title.toLowerCase()
    const snippet = a.snippet.toLowerCase()
    let matchCount = a.keywords.filter((k) => q.includes(k) || k.includes(q)).length
    const wordMatchCount = qWords.filter((w) => title.includes(w) || snippet.includes(w)).length
    matchCount += wordMatchCount * 0.5
    const bonus = title.includes(q) ? 2 : 0
    return { ...a, score: matchCount + bonus }
  })
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ keywords: _, score: __, ...rest }) => rest)
}

export async function POST(req: NextRequest) {
  const { query } = await req.json()
  if (!query || typeof query !== "string") {
    return NextResponse.json({ articles: [], source: "fallback" }, { status: 400 })
  }

  const serperKey = process.env.SERPER_API_KEY

  if (serperKey) {
    try {
      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "X-API-KEY": serperKey, "Content-Type": "application/json" },
        body: JSON.stringify({ q: query, gl: "vn", hl: "vi", num: 4 }),
      })
      const data = await res.json()
      if (res.ok && data.organic?.length > 0) {
        const articles = data.organic.map((item: any) => ({
          title: item.title,
          url: item.link,
          snippet: item.snippet,
          source: new URL(item.link).hostname,
        }))
        return NextResponse.json({ articles, source: "serper" })
      }
    } catch (e) {
      console.error("Serper API error:", e)
    }
  }

  const articles = getFallbackArticles(query)
  return NextResponse.json({ articles, source: "fallback" })
}
