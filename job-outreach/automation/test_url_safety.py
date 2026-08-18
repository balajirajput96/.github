import importlib.util
import pathlib
import socket
import unittest
from unittest.mock import patch


MODULE_PATH = pathlib.Path(__file__).with_name("run_repo.py")
SPEC = importlib.util.spec_from_file_location("run_repo", MODULE_PATH)
run_repo = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(run_repo)


class FakeResponse:
    def __init__(self, status_code, text="", headers=None):
        self.status_code = status_code
        self.text = text
        self.headers = headers or {}


class UrlSafetyTests(unittest.TestCase):
    def setUp(self):
        run_repo.DIAG.clear()

    @patch.object(run_repo.socket, "getaddrinfo")
    def test_rejects_any_private_address_from_multi_address_dns(self, getaddrinfo):
        getaddrinfo.return_value = [
            (socket.AF_INET, socket.SOCK_STREAM, 6, "", ("93.184.216.34", 0)),
            (socket.AF_INET6, socket.SOCK_STREAM, 6, "", ("::1", 0, 0, 0)),
        ]

        self.assertFalse(run_repo.is_safe_url("https://jobs.example.com"))

    @patch.object(run_repo.socket, "getaddrinfo")
    def test_accepts_only_global_http_addresses_on_standard_ports(self, getaddrinfo):
        getaddrinfo.return_value = [
            (socket.AF_INET, socket.SOCK_STREAM, 6, "", ("93.184.216.34", 0)),
        ]

        self.assertTrue(run_repo.is_safe_url("https://jobs.example.com/openings"))
        self.assertFalse(run_repo.is_safe_url("https://jobs.example.com:8080/openings"))

    @patch.object(run_repo.session, "get")
    @patch.object(run_repo, "is_safe_url", side_effect=lambda url: url == "https://jobs.example.com/openings")
    def test_rejects_redirect_to_private_network_before_following(self, is_safe_url, get):
        get.return_value = FakeResponse(302, headers={"Location": "http://127.0.0.1/admin"})

        self.assertEqual(run_repo.fetch_html("https://jobs.example.com/openings"), "")
        get.assert_called_once()
        self.assertIn("fetch BLOCKED (unsafe URL): http://127.0.0.1/admin", run_repo.DIAG)


if __name__ == "__main__":
    unittest.main()
