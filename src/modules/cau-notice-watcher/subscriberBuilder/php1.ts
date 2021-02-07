import { SubscriberBuilder } from '..'

/*
 * Go notice board list you want to try this subscriberbuilder and run the code below via browser developer console
 * console.log([...document.querySelectorAll('table.tbl-list_new tr td.line_bottom[align="left"]:not(.bg_color1)')].map(i => { return {title: i.querySelector('a').textContent, url: location.href + '?p_mode=view&p_idx=' + /view\('([0-9]+)'\)/.exec(i.querySelector('a').href)[1]}}));
 *
 * If code above runs very well and output is generated very well, then this builder would work very well for that website.
 */
export const php1: SubscriberBuilder = ({ name, key, url }) => {
  return {
    name,
    key,
    url,
    noticeItemSelector:
      'table.tbl-list_new tr td.line_bottom[align="left"]:not(.bg_color1)',
    titleBuilder: (noticeElm) =>
      noticeElm.querySelector('a').textContent.trim(),
    urlBuilder: (noticeElm) =>
      url +
      '?p_mode=view&p_idx=' +
      /view\('([0-9]+)'\)/.exec(noticeElm.querySelector('a').href)[1],
  }
}
