<?php

if (!function_exists('show_route')) {

    function generatePhoneNumber(): string
    {
        $phone_number = fake()->phoneNumber();
        $phone_number = preg_replace("/[+.()]/", "", $phone_number);
        return substr($phone_number, 0, 13);
    }
}