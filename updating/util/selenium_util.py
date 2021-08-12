from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

# define function to get necessary capabilites and options for selenium Chrome webdriver
def generate_driver_settings(proxy):
    # generate chrome options for proper user-agent
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    user_agent = (
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36"
    )
    chrome_options.add_argument(f"user-agent={user_agent}")
    # chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--ignore-certificate-errors")
    prefs = {
        "profile.managed_default_content_settings.images": 2,
        "profile.default_content_setting_values.notifications": 2,
        "profile.managed_default_content_settings.stylesheets": 2,
        "profile.managed_default_content_settings.cookies": 2,
        "profile.managed_default_content_settings.javascript": 1,
        "profile.managed_default_content_settings.plugins": 1,
        "profile.managed_default_content_settings.popups": 2,
        "profile.managed_default_content_settings.geolocation": 2,
        "profile.managed_default_content_settings.media_stream": 2,
    }
    chrome_options.add_experimental_option("prefs", prefs)
    chrome_options.add_argument("--log-level=3")
    # generate PROXY capabilites
    capabilites = webdriver.DesiredCapabilities.CHROME.copy()
    capabilites["acceptInsecureCerts"] = True
    """
    capabilites["proxy"] = {
        "httpProxy": proxy,
        "proxyType": "MANUAL",
        "autodetect": False,
    }
    """
    return chrome_options, capabilites


# get chrome_options and capabilites for selenium
chrome_options, capabilites = generate_driver_settings("xx")
driver = webdriver.Chrome("chromedriver.exe", options=chrome_options, desired_capabilities=capabilites,)
