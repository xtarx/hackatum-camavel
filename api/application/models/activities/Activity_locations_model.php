<?php

if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

class activity_locations_model extends MY_Model
{

    protected $_table      = 'activity_locations';
    protected $return_type = 'array';
    public $belongs_to     = array('activites');

}
