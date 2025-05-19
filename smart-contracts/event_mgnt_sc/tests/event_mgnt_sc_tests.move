#[test_only]
module event_mgnt_sc::event_mgnt_sc_tests {
    use sui::test_scenario;
    use sui::object;
    use sui::vec_map;
    use std::string;
    use event_mgnt_sc::event_mgnt_sc::{Self, Platform, Event, EventCap, initialize_platform};

    #[test]
    fun test_ticket_basic_logic() {
        let platform_addr = @0xCAFE;
        let event_creator = @0xFACE;

        // Begin test scenario with the platform admin
        let mut scenario_val = test_scenario::begin(platform_addr);
        let scenario = &mut scenario_val;

        // First transaction: Initialize Platform
        {
            event_mgnt_sc::initialize_platform(scenario.ctx());
        };

        // Second transaction: Create Event (by event_creator)
        scenario.next_tx(event_creator);
        {
            // Retrieve the Platform object
            let mut platform = scenario.take_from_sender<Platform>();
            let ctx = scenario.ctx();

            // Create an event
            let eid = event_mgnt_sc::create_event(
                &mut platform,
                string::utf8(b"Dev Fest"),
                string::utf8(b"Tech Event"),
                1700000000,
                string::utf8(b"Lagos"),
                true,
                100000000,
                100,
                ctx
            );

            // Return the Platform to storage
            scenario.return_to_sender(platform);
        };

        // Third transaction: Validate the created event
        scenario.next_tx(event_creator);
        {
            // Retrieve the Platform object
            let platform = scenario.take_from_sender<Platform>();
            // Retrieve the Event object (transferred to event_creator in create_event)
            let event = scenario.take_from_sender<Event>();
            // Retrieve the EventCap object (also transferred to event_creator)
            let event_cap = scenario.take_from_sender<EventCap>();

            // Get the event ID from the Platform's events map
            let keys = vec_map::keys(event_mgnt_sc::get_platform_events(&platform));
            assert!(!keys.is_empty(), 100);
            let eid = *vector::borrow(&keys, 0);

            // Verify event ID matches
            assert!(eid == event_mgnt_sc::get_event_id(&event), 101);
            assert!(eid == event_mgnt_sc::get_event_cap_event_id(&event_cap), 102);

            // Verify event details
            assert!(event_mgnt_sc::get_event_name(&event) == string::utf8(b"Dev Fest"), 103);
            assert!(event_mgnt_sc::get_event_description(&event) == string::utf8(b"Tech Event"), 104);
            assert!(event_mgnt_sc::get_event_timestamp(&event) == 1700000000, 105);
            assert!(event_mgnt_sc::get_event_location(&event) == string::utf8(b"Lagos"), 106);
            assert!(event_mgnt_sc::get_event_is_paid(&event), 107);
            assert!(event_mgnt_sc::get_event_ticket_price(&event) == 100000000, 108);
            assert!(event_mgnt_sc::get_event_max_tickets(&event) == 100, 109);
            assert!(event_mgnt_sc::get_event_tickets_sold(&event) == 0, 110);
            assert!(event_mgnt_sc::get_event_closed(&event) == false, 111);
            assert!(event_mgnt_sc::get_event_organizer(&event) == event_creator, 112);

            // Return objects to storage
            scenario.return_to_sender(platform);
            scenario.return_to_sender(event);
            scenario.return_to_sender(event_cap);
        };

        // End the test scenario
        scenario_val.end();
    }
}
/*
#[test_only]
module event_mgnt_sc::event_mgnt_sc_tests;
// uncomment this line to import the module
// use event_mgnt_sc::event_mgnt_sc;

const ENotImplemented: u64 = 0;

#[test]
fun test_event_mgnt_sc() {
    // pass
}

#[test, expected_failure(abort_code = ::event_mgnt_sc::event_mgnt_sc_tests::ENotImplemented)]
fun test_event_mgnt_sc_fail() {
    abort ENotImplemented
}
*/
